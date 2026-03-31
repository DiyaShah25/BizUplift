import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [wishlists, setWishlists] = useState({});
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [dataError, setDataError] = useState(null);

    // ─── Normalize MongoDB document IDs ──────────────────────────────────────
    // MongoDB uses `_id` but the frontend often uses `.id`.
    // Map _id → id for seamless compatibility.
    const normalize = (docs) =>
        docs.map(d => ({ ...d, id: d._id || d.id }));

    // ─── Initial Data Fetch from Backend ─────────────────────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            setIsDataLoading(true);
            setDataError(null);
            try {
                const [productsRes, sellersRes, postsRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/sellers'),
                    api.get('/posts'),
                ]);
                setProducts(normalize(Array.isArray(productsRes) ? productsRes : productsRes.products || []));
                setSellers(normalize(Array.isArray(sellersRes) ? sellersRes : sellersRes.sellers || []));
                setPosts(normalize(Array.isArray(postsRes) ? postsRes : postsRes.posts || []));
            } catch (err) {
                console.error('[DataContext] Failed to fetch initial data:', err);
                setDataError('Failed to load data. Please check your internet connection and try again.');
            } finally {
                setIsDataLoading(false);
            }
        };
        fetchAll();
    }, []);

    // ─── Products ─────────────────────────────────────────────────────────────
    const addProduct = async (product) => {
        const newProduct = await api.post('/products', product);
        setProducts(prev => [{ ...newProduct, id: newProduct._id }, ...prev]);
        return newProduct;
    };

    const updateProduct = async (id, updates) => {
        const updated = await api.put(`/products/${id}`, updates);
        setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? { ...updated, id: updated._id } : p));
    };

    const deleteProduct = async (id) => {
        await api.delete(`/products/${id}`);
        setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
    };

    // ─── Orders ───────────────────────────────────────────────────────────────
    const fetchOrders = useCallback(async () => {
        const data = await api.get('/orders');
        const normalized = normalize(Array.isArray(data) ? data : data.orders || []);
        setOrders(normalized);
        return normalized;
    }, []);

    const addOrder = async (order) => {
        const newOrder = await api.post('/orders', order);
        setOrders(prev => [...prev, { ...newOrder, id: newOrder._id }]);
        return newOrder;
    };

    const updateOrderStatus = async (id, status) => {
        await api.put(`/orders/${id}`, { status });
        setOrders(prev => prev.map(o => (o.id === id || o._id === id) ? { ...o, status } : o));
    };

    // ─── Posts ────────────────────────────────────────────────────────────────
    const addPost = async (post) => {
        const newPost = await api.post('/posts', post);
        setPosts(prev => [{ ...newPost, id: newPost._id }, ...prev]);
        return newPost;
    };

    const toggleLike = async (postId, userId) => {
        // Optimistic update
        setPosts(prev => prev.map(p => {
            if (p.id !== postId && p._id !== postId) return p;
            const likedBy = p.likedBy || [];
            const liked = likedBy.includes(userId);
            return { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likedBy: liked ? likedBy.filter(id => id !== userId) : [...likedBy, userId] };
        }));
        try {
            await api.put(`/posts/${postId}/like`, { userId });
        } catch {
            // Revert on failure
            setPosts(prev => prev.map(p => {
                if (p.id !== postId && p._id !== postId) return p;
                const likedBy = p.likedBy || [];
                const liked = likedBy.includes(userId);
                return { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likedBy: liked ? likedBy.filter(id => id !== userId) : [...likedBy, userId] };
            }));
        }
    };

    // ─── Wishlist ─────────────────────────────────────────────────────────────
    const fetchWishlist = useCallback(async (userId) => {
        try {
            const data = await api.get(`/wishlist/${userId}`);
            const ids = (data.items || data || []).map(item => item.productId || item);
            setWishlists(prev => ({ ...prev, [userId]: ids }));
            return ids;
        } catch { return []; }
    }, []);

    const toggleWishlist = async (userId, productId) => {
        const userList = wishlists[userId] || [];
        const isInList = userList.includes(productId);
        // Optimistic update
        setWishlists(prev => ({
            ...prev,
            [userId]: isInList ? userList.filter(id => id !== productId) : [...userList, productId]
        }));
        try {
            if (isInList) {
                await api.delete(`/wishlist/${userId}/${productId}`);
            } else {
                await api.post(`/wishlist/${userId}`, { productId });
            }
        } catch {
            // Revert
            setWishlists(prev => ({ ...prev, [userId]: userList }));
        }
    };

    const isWishlisted = (userId, productId) => (wishlists[userId] || []).includes(productId);

    // ─── Reviews ──────────────────────────────────────────────────────────────
    const addReview = async (review) => {
        const newReview = await api.post('/reviews', review);
        setReviews(prev => [...prev, { ...newReview, id: newReview._id }]);
        return newReview;
    };

    const getProductReviews = (productId) =>
        reviews.filter(r => r.productId === productId || r.productId?._id === productId);

    const fetchProductReviews = useCallback(async (productId) => {
        const data = await api.get(`/reviews/${productId}`);
        const normalized = normalize(Array.isArray(data) ? data : data.reviews || []);
        setReviews(prev => {
            const filtered = prev.filter(r => r.productId !== productId && r.productId?._id !== productId);
            return [...filtered, ...normalized];
        });
        return normalized;
    }, []);

    // ─── Credits ──────────────────────────────────────────────────────────────
    const addCredits = async (userId, points, action) => {
        if (!userId) return;
        try {
            await api.post('/credits/add', { userId, points, action });
        } catch (err) {
            console.warn('[Credits] Failed to save credits to backend:', err);
        }
    };

    const getUserCredits = useCallback(async (userId) => {
        try {
            const data = await api.get(`/credits/${userId}`);
            return data;
        } catch { return { balance: 0, transactions: [] }; }
    }, []);

    // ─── Sellers ─────────────────────────────────────────────────────────────
    const createSellerProfile = async (profile) => {
        const newSeller = await api.post('/sellers', profile);
        setSellers(prev => [...prev, { ...newSeller, id: newSeller._id }]);
        return newSeller._id;
    };

    // ─── Negotiations ─────────────────────────────────────────────────────────
    const saveNegotiation = async (negotiation) => {
        try {
            await api.post('/negotiations', negotiation);
        } catch (err) {
            console.warn('[Negotiations] Failed to save negotiation:', err);
        }
    };

    return (
        <DataContext.Provider value={{
            // Data
            products, sellers, posts, orders, reviews, wishlists,
            isDataLoading, dataError,

            // Products
            addProduct, updateProduct, deleteProduct,

            // Orders
            fetchOrders, addOrder, updateOrderStatus,

            // Posts / Community
            addPost, toggleLike,

            // Wishlist
            fetchWishlist, toggleWishlist, isWishlisted,

            // Reviews
            addReview, getProductReviews, fetchProductReviews,

            // Credits
            addCredits, getUserCredits,

            // Sellers
            createSellerProfile,

            // Negotiations
            saveNegotiation,

            // Users — legacy compat stubs (now handled by AuthContext)
            registerUser: () => { console.warn('Use AuthContext.register() instead'); },
            updateUser: () => { console.warn('Use AuthContext.updateCurrentUser() instead'); },
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
