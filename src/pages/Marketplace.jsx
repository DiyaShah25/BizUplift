import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Star, ShoppingBag, Heart, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const CATEGORIES = ['All', 'Handicrafts', 'Food & Sweets', 'Clothing', 'Decoration', 'Jewelry', 'Candles & Diyas', 'Pottery'];
const FESTIVALS_LIST = ['All', 'Diwali', 'Holi', 'Navratri', 'Eid', 'Christmas', 'Pongal', 'Onam', 'Lohri'];
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'negotiable', label: 'Negotiable First' },
];

const ProductCard = ({ product, isWishlisted, onWishlist }) => {
    const { addToCart } = useCart();
    const { showToast } = useNotifications();
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        addToCart(product);
        setAdded(true);
        showToast(`${product.name.slice(0, 30)}... added to cart!`);
        setTimeout(() => setAdded(false), 1500);
    };

    const savings = product.mrp - product.price;
    const savingsPct = Math.round((savings / product.mrp) * 100);

    return (
        <div className="group festival-card rounded-2xl overflow-hidden card-3d transition-all duration-300">
            <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'rgb(var(--color-primary))' }}>{product.festival}</span>
                        {savingsPct > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">{savingsPct}% OFF</span>}
                    </div>
                    {product.negotiable && (
                        <div className="absolute top-2 right-10 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-bold text-green-600">🤝</div>
                    )}
                    {/* Wishlist */}
                    <button onClick={(e) => { e.preventDefault(); onWishlist(product.id); }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow transition-transform hover:scale-110">
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                    {/* Stock warning */}
                    {product.stock < 10 && (
                        <div className="absolute bottom-2 left-2 bg-red-500/90 text-white text-xs px-2 py-0.5 rounded-full">Only {product.stock} left!</div>
                    )}
                </div>
            </Link>
            <div className="p-3">
                <Link to={`/seller/${product.sellerId}`} className="text-xs text-gray-500 hover:text-primary transition-colors">{product.sellerName}</Link>
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-sm line-clamp-2 mt-0.5 mb-2 hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-bold" style={{ color: 'rgb(var(--color-primary))' }}>₹{product.price}</span>
                        {product.mrp > product.price && <span className="text-xs text-gray-400 line-through ml-1">₹{product.mrp}</span>}
                        {product.negotiable && <span className="block text-xs text-green-600 font-medium">Negotiable</span>}
                    </div>
                    <button onClick={handleAdd}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-all ${added ? 'scale-110 bg-green-500' : 'hover:scale-105'}`}
                        style={added ? {} : { background: 'var(--btn-gradient)' }}>
                        {added ? '✓ Added' : <><ShoppingBag className="w-3 h-3" /> Add</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Marketplace = () => {
    const { products, isWishlisted, toggleWishlist } = useData();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState('All');
    const [festival, setFestival] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [negotiableOnly, setNegotiableOnly] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [page, setPage] = useState(1);
    const PER_PAGE = 12;

    useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);

    const filtered = useMemo(() => {
        let result = [...products];
        if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.sellerName.toLowerCase().includes(search.toLowerCase()));
        if (category !== 'All') result = result.filter(p => p.category === category);
        if (festival !== 'All') result = result.filter(p => p.festival === festival || p.festival === 'All');
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        if (minRating > 0) result = result.filter(p => p.rating >= minRating);
        if (inStockOnly) result = result.filter(p => p.stock > 0);
        if (negotiableOnly) result = result.filter(p => p.negotiable);
        switch (sortBy) {
            case 'price_asc': result.sort((a, b) => a.price - b.price); break;
            case 'price_desc': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            case 'negotiable': result.sort((a, b) => (b.negotiable ? 1 : 0) - (a.negotiable ? 1 : 0)); break;
            default: result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return result;
    }, [products, search, category, festival, priceRange, minRating, sortBy, inStockOnly, negotiableOnly]);

    const paginated = filtered.slice(0, page * PER_PAGE);
    const hasMore = paginated.length < filtered.length;

    const activeFilters = [
        category !== 'All' && { label: category, clear: () => setCategory('All') },
        festival !== 'All' && { label: festival, clear: () => setFestival('All') },
        minRating > 0 && { label: `${minRating}★+`, clear: () => setMinRating(0) },
        inStockOnly && { label: 'In Stock', clear: () => setInStockOnly(false) },
        negotiableOnly && { label: 'Negotiable', clear: () => setNegotiableOnly(false) },
    ].filter(Boolean);

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Category */}
            <div>
                <h3 className="font-bold text-sm mb-3">Category</h3>
                <div className="space-y-2">
                    {CATEGORIES.map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)} className="accent-primary" />
                            <span className="text-sm">{c}</span>
                        </label>
                    ))}
                </div>
            </div>
            {/* Festival */}
            <div>
                <h3 className="font-bold text-sm mb-3">Festival</h3>
                <div className="space-y-2">
                    {FESTIVALS_LIST.map(f => (
                        <label key={f} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="festival" checked={festival === f} onChange={() => setFestival(f)} className="accent-primary" />
                            <span className="text-sm">{f}</span>
                        </label>
                    ))}
                </div>
            </div>
            {/* Price Range */}
            <div>
                <h3 className="font-bold text-sm mb-3">Price Range</h3>
                <div className="space-y-2">
                    <input type="range" min={0} max={10000} step={100} value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])} className="w-full accent-primary" />
                    <div className="flex justify-between text-xs text-gray-500"><span>₹0</span><span>₹{priceRange[1].toLocaleString()}</span></div>
                </div>
            </div>
            {/* Rating */}
            <div>
                <h3 className="font-bold text-sm mb-3">Minimum Rating</h3>
                <div className="flex gap-2 flex-wrap">
                    {[0, 3, 4, 4.5].map(r => (
                        <button key={r} onClick={() => setMinRating(r)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${minRating === r ? 'text-white border-transparent' : 'border-gray-200'}`} style={minRating === r ? { background: 'rgb(var(--color-primary))' } : {}}>
                            {r === 0 ? 'All' : `${r}★+`}
                        </button>
                    ))}
                </div>
            </div>
            {/* Toggles */}
            <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium">In Stock Only</span>
                    <div onClick={() => setInStockOnly(!inStockOnly)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${inStockOnly ? 'bg-primary' : 'bg-gray-200'}`} style={inStockOnly ? { background: 'rgb(var(--color-primary))' } : {}}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${inStockOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium">Negotiable Only</span>
                    <div onClick={() => setNegotiableOnly(!negotiableOnly)} className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer`} style={{ background: negotiableOnly ? 'rgb(var(--color-primary))' : '#E5E7EB' }}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${negotiableOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                </label>
            </div>
            <button onClick={() => { setCategory('All'); setFestival('All'); setPriceRange([0, 10000]); setMinRating(0); setInStockOnly(false); setNegotiableOnly(false); setSearch(''); }} className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                Clear All Filters
            </button>
        </div>
    );

    return (
        <div className="container py-6 pb-20 lg:pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-heading font-bold">Marketplace</h1>
                    <p className="text-sm text-gray-500">{filtered.length} products found</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none font-body">
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium">
                        <SlidersHorizontal className="w-4 h-4" /> Filters {activeFilters.length > 0 && <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center" style={{ background: 'rgb(var(--color-primary))' }}>{activeFilters.length}</span>}
                    </button>
                </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products, sellers..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm font-body" />
                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {activeFilters.map((f, i) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: 'rgb(var(--color-primary))' }}>
                            {f.label} <button onClick={f.clear}><X className="w-3 h-3" /></button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex gap-6">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <div className="festival-card rounded-2xl p-5 sticky top-20">
                        <h2 className="font-bold mb-4">Filters</h2>
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Mobile Sidebar Drawer */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div className="bg-black/50 flex-1" onClick={() => setSidebarOpen(false)} />
                        <div className="w-72 bg-white h-full overflow-y-auto p-5 shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold">Filters</h2>
                                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
                            </div>
                            <FilterSidebar />
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                <div className="flex-1">
                    {paginated.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 perspective-container">
                                {paginated.map(p => (
                                    <ProductCard key={p.id} product={p}
                                        isWishlisted={currentUser ? isWishlisted(currentUser.id, p.id) : false}
                                        onWishlist={(id) => currentUser ? toggleWishlist(currentUser.id, id) : null}
                                    />
                                ))}
                            </div>
                            {hasMore && (
                                <div className="text-center mt-8">
                                    <button onClick={() => setPage(p => p + 1)} className="px-8 py-3 rounded-full font-bold text-white" style={{ background: 'var(--btn-gradient)' }}>
                                        Load More ({filtered.length - paginated.length} remaining)
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
