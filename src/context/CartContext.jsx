import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [appliedCredits, setAppliedCredits] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('bizuplift_cart');
        if (stored) setCartItems(JSON.parse(stored));
    }, []);

    const persist = (items) => {
        setCartItems(items);
        localStorage.setItem('bizuplift_cart', JSON.stringify(items));
    };

    const addToCart = (product, quantity = 1, negotiatedPrice = null) => {
        const existing = cartItems.find(item => item.productId === product.id && item.negotiatedPrice === negotiatedPrice);
        if (existing) {
            persist(cartItems.map(item =>
                item.productId === product.id && item.negotiatedPrice === negotiatedPrice
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            persist([...cartItems, {
                id: `ci_${Date.now()}`,
                productId: product.id,
                name: product.name,
                image: product.images[0],
                sellerId: product.sellerId,
                sellerName: product.sellerName,
                originalPrice: product.price,
                negotiatedPrice,
                price: negotiatedPrice || product.price,
                quantity,
                isNegotiated: !!negotiatedPrice,
            }]);
        }
    };

    const removeFromCart = (itemId) => persist(cartItems.filter(item => item.id !== itemId));

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return removeFromCart(itemId);
        persist(cartItems.map(item => item.id === itemId ? { ...item, quantity } : item));
    };

    const clearCart = () => persist([]);

    const applyCoupon = (code) => {
        const coupons = { 'HOLI20': 20, 'DIWALI15': 15, 'NEWUSER10': 10, 'BIZUPLIFT': 5 };
        if (coupons[code.toUpperCase()]) {
            setCouponCode(code.toUpperCase());
            setCouponDiscount(coupons[code.toUpperCase()]);
            return { success: true, discount: coupons[code.toUpperCase()] };
        }
        return { success: false };
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const couponAmount = Math.floor(subtotal * couponDiscount / 100);
    const creditsAmount = Math.min(appliedCredits, Math.floor(subtotal * 0.1)); // max 10% via credits
    const deliveryFee = subtotal > 999 ? 0 : 49;
    const total = subtotal - couponAmount - creditsAmount + deliveryFee;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, itemCount, subtotal, couponAmount, creditsAmount, deliveryFee, total,
            appliedCredits, setAppliedCredits, couponCode, couponDiscount,
            addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
