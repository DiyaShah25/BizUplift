import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Users, Zap, Gift, ChevronRight, Play } from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

const FESTIVALS = [
    { id: 'diwali', name: 'Diwali', emoji: '🪔', date: new Date('2025-10-20'), color: '#FFD700', bg: 'from-[#0D1B2A] to-[#1a0a3a]' },
    { id: 'holi', name: 'Holi', emoji: '🎨', date: new Date('2025-03-14'), color: '#FF006E', bg: 'from-pink-500 to-cyan-400' },
    { id: 'navratri', name: 'Navratri', emoji: '💃', date: new Date('2025-10-02'), color: '#DC267F', bg: 'from-purple-700 to-pink-500' },
    { id: 'default', name: 'Eid', emoji: '🌙', date: new Date('2025-03-30'), color: '#1B5E20', bg: 'from-emerald-800 to-green-600' },
    { id: 'default', name: 'Christmas', emoji: '🎄', date: new Date('2025-12-25'), color: '#C62828', bg: 'from-green-900 to-red-800' },
    { id: 'default', name: 'Pongal', emoji: '🌾', date: new Date('2026-01-14'), color: '#BF5700', bg: 'from-orange-800 to-yellow-600' },
    { id: 'default', name: 'Onam', emoji: '🌸', date: new Date('2025-09-05'), color: '#FF6F00', bg: 'from-orange-600 to-yellow-400' },
    { id: 'default', name: 'Raksha Bandhan', emoji: '🎀', date: new Date('2025-08-09'), color: '#E91E8C', bg: 'from-pink-600 to-purple-500' },
    { id: 'default', name: 'Dussehra', emoji: '🏹', date: new Date('2025-10-02'), color: '#FF6B00', bg: 'from-orange-700 to-red-600' },
    { id: 'default', name: 'Lohri', emoji: '🔥', date: new Date('2026-01-13'), color: '#FF6B00', bg: 'from-red-700 to-orange-500' },
];

const getDaysUntil = (date) => {
    const diff = date - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
};

const Countdown = ({ targetDate }) => {
    const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        const tick = () => {
            const diff = Math.max(0, targetDate - Date.now());
            setTime({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return (
        <div className="flex gap-3">
            {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, label]) => (
                <div key={k} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold font-heading" style={{ background: 'var(--heading-gradient)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        {String(time[k]).padStart(2, '0')}
                    </div>
                    <div className="text-xs opacity-60">{label}</div>
                </div>
            ))}
        </div>
    );
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useNotifications();
    const [added, setAdded] = useState(false);
    const handleAdd = (e) => {
        e.preventDefault();
        addToCart(product);
        setAdded(true);
        showToast(`${product.name} added to cart!`);
        setTimeout(() => setAdded(false), 1500);
    };
    return (
        <Link to={`/product/${product.id}`} className="group block festival-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <div className="relative overflow-hidden aspect-square">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div className="absolute top-2 left-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: 'rgb(var(--color-primary))' }}>{product.festival}</span>
                </div>
                {product.negotiable && (
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-bold text-green-600">🤝 Negotiable</div>
                )}
            </div>
            <div className="p-3">
                <p className="text-xs text-gray-500 mb-1">{product.sellerName}</p>
                <h3 className="font-semibold text-sm line-clamp-2 mb-2" style={{ color: 'rgb(var(--color-secondary))' }}>{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-bold text-sm" style={{ color: 'rgb(var(--color-primary))' }}>₹{product.price}</span>
                        {product.mrp > product.price && <span className="text-xs text-gray-400 line-through ml-1">₹{product.mrp}</span>}
                    </div>
                    <button onClick={handleAdd} className={`p-1.5 rounded-lg text-white text-xs font-bold transition-all ${added ? 'scale-110' : 'hover:scale-105'}`} style={{ background: 'var(--btn-gradient)' }}>
                        {added ? '✓' : <ShoppingBag className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>
        </Link>
    );
};

const SellerCard = ({ seller }) => (
    <Link to={`/seller/${seller.id}`} className="festival-card rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 block">
        <div className="flex items-center gap-3 mb-3">
            <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: 'rgb(var(--color-primary))' }} />
            <div>
                <div className="flex items-center gap-1">
                    <h3 className="font-bold text-sm">{seller.business}</h3>
                    {seller.verified && <span className="text-blue-500 text-xs">✓</span>}
                </div>
                <p className="text-xs text-gray-500">{seller.city}, {seller.state}</p>
            </div>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{seller.story}</p>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{seller.rating}</span>
                <span className="text-xs text-gray-400">· {seller.totalOrders} orders</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>View Shop →</span>
        </div>
    </Link>
);

const Home = () => {
    const { theme, setTheme } = useTheme();
    const { products, sellers, posts } = useData();
    const navigate = useNavigate();
    const [heroFestival, setHeroFestival] = useState(FESTIVALS[0]);

    const featuredProducts = products.filter(p => p.featured).slice(0, 8);
    const trendingProducts = products.slice(0, 8);
    const featuredSellers = sellers.slice(0, 4);
    const recentPosts = posts.slice(0, 3);

    const handleFestivalChip = (festival) => {
        setHeroFestival(festival);
        if (festival.id !== 'default') setTheme(festival.id);
    };

    const isDiwali = theme === 'diwali';

    return (
        <div className="pb-16 lg:pb-0">
            {/* ── Hero Section ── */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ background: isDiwali ? 'linear-gradient(135deg, #0D1B2A 0%, #1a0a3a 50%, #0D0221 100%)' : 'linear-gradient(135deg, rgb(var(--color-background)) 0%, rgba(var(--color-primary), 0.05) 100%)' }}>
                {/* Decorative blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgb(var(--color-primary)), transparent)' }} />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgb(var(--color-accent)), transparent)', animationDelay: '1s' }} />
                </div>

                <div className="container relative z-10 py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-fade-in-up">
                            {/* Festival badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6" style={{ background: 'rgba(var(--color-primary), 0.15)', color: 'rgb(var(--color-primary))' }}>
                                <span className="text-lg">{heroFestival.emoji}</span>
                                <span>{heroFestival.name} Special</span>
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'rgb(var(--color-primary))' }} />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight mb-4" style={{ color: isDiwali ? '#FFF8E7' : 'rgb(var(--color-secondary))' }}>
                                <span className="festival-heading">Celebrate.</span>
                                <br />Discover.
                                <br />Support Local.
                            </h1>
                            <p className="text-lg mb-6 max-w-md" style={{ color: isDiwali ? 'rgba(255,248,231,0.7)' : '#6B7280' }}>
                                India's festival marketplace for authentic handmade products from small sellers who pour their heart into every creation.
                            </p>

                            {/* Countdown */}
                            <div className="mb-8">
                                <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-60" style={{ color: isDiwali ? '#FFF8E7' : '#374151' }}>Next Festival In</p>
                                <Countdown targetDate={heroFestival.date} />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link to="/marketplace" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105 hover:shadow-lg" style={{ background: 'var(--btn-gradient)' }}>
                                    Shop Now <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 transition-all hover:scale-105" style={{ borderColor: 'rgb(var(--color-primary))', color: 'rgb(var(--color-primary))' }}>
                                    Sell With Us
                                </Link>
                            </div>
                        </div>

                        {/* Hero visual */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="relative w-80 h-80">
                                <div className="absolute inset-0 rounded-full animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(var(--color-primary), 0.2), transparent)' }} />
                                <div className="absolute inset-8 rounded-full flex items-center justify-center text-9xl animate-float">
                                    {heroFestival.emoji}
                                </div>
                                {/* Orbiting product images */}
                                {featuredProducts.slice(0, 4).map((p, i) => (
                                    <div key={p.id} className="absolute w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg animate-float" style={{ top: `${[0, 50, 80, 30][i]}%`, left: `${[80, 90, 20, -10][i]}%`, animationDelay: `${i * 0.5}s` }}>
                                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Festival Carousel ── */}
            <section className="py-6 border-b" style={{ borderColor: 'rgba(var(--color-primary), 0.1)' }}>
                <div className="container">
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                        {FESTIVALS.map((festival, i) => {
                            const days = getDaysUntil(festival.date);
                            return (
                                <button key={i} onClick={() => handleFestivalChip(festival)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all hover:scale-105 ${heroFestival.name === festival.name ? 'text-white border-transparent' : 'border-current'}`}
                                    style={{ background: heroFestival.name === festival.name ? festival.color : 'transparent', color: heroFestival.name === festival.name ? 'white' : festival.color }}>
                                    <span>{festival.emoji}</span>
                                    <span>{festival.name}</span>
                                    <span className="text-xs opacity-70">{days === 0 ? '🔴 Now' : `${days}d`}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Trending Products ── */}
            <section className="py-12">
                <div className="container">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-heading font-bold">Trending Festival Products</h2>
                            <p className="text-sm text-gray-500 mt-1">Handpicked by our community</p>
                        </div>
                        <Link to="/marketplace" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: 'rgb(var(--color-primary))' }}>
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {trendingProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            </section>

            {/* ── Featured Sellers ── */}
            <section className="py-12" style={{ background: 'rgba(var(--color-primary), 0.03)' }}>
                <div className="container">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-heading font-bold">Featured Sellers</h2>
                            <p className="text-sm text-gray-500 mt-1">Real stories, real people</p>
                        </div>
                        <Link to="/collaborate" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: 'rgb(var(--color-primary))' }}>
                            All Sellers <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {featuredSellers.map(s => <SellerCard key={s.id} seller={s} />)}
                    </div>
                </div>
            </section>

            {/* ── Hamper Spotlight ── */}
            <section className="py-12">
                <div className="container">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-heading font-bold">Festival Hamper Spotlight</h2>
                            <p className="text-sm text-gray-500 mt-1">Curated gift sets for every occasion</p>
                        </div>
                        <Link to="/hamper" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: 'rgb(var(--color-primary))' }}>
                            Build Yours <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Diwali Delight', emoji: '🪔', items: ['Lakshmi Diya Set', 'Kaju Katli Box', 'Brass Puja Thali'], price: 1899, color: '#FFD700' },
                            { name: 'Holi Splash', emoji: '🎨', items: ['Organic Gulal Set', 'Premium Pichkari', 'Thandai Mix'], price: 849, color: '#FF006E' },
                            { name: 'Navratri Celebration', emoji: '💃', items: ['Dandiya Sticks', 'Chaniya Choli', 'Garland Set'], price: 3299, color: '#DC267F' },
                        ].map(hamper => (
                            <div key={hamper.name} className="festival-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300">
                                <div className="text-4xl mb-3">{hamper.emoji}</div>
                                <h3 className="font-bold text-lg mb-2">{hamper.name}</h3>
                                <ul className="space-y-1 mb-4">
                                    {hamper.items.map(item => <li key={item} className="text-sm text-gray-600 flex items-center gap-2"><span style={{ color: hamper.color }}>✓</span>{item}</li>)}
                                </ul>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg" style={{ color: hamper.color }}>₹{hamper.price}</span>
                                    <Link to="/hamper" className="px-4 py-2 rounded-full text-sm font-bold text-white" style={{ background: hamper.color }}>Customize</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Community Highlights ── */}
            <section className="py-12" style={{ background: 'rgba(var(--color-primary), 0.03)' }}>
                <div className="container">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-heading font-bold">Community Highlights</h2>
                            <p className="text-sm text-gray-500 mt-1">What our community is saying</p>
                        </div>
                        <Link to="/community" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all" style={{ color: 'rgb(var(--color-primary))' }}>
                            Join Community <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentPosts.map(post => (
                            <div key={post.id} className="festival-card rounded-2xl overflow-hidden">
                                {post.image && <img src={post.image} alt="" className="w-full h-40 object-cover" loading="lazy" />}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src={post.authorAvatar} alt="" className="w-7 h-7 rounded-full" />
                                        <span className="text-sm font-semibold">{post.authorName}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(var(--color-primary), 0.1)', color: 'rgb(var(--color-primary))' }}>{post.festival}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                                        <span>❤️ {post.likes}</span>
                                        <span>💬 {post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Credits Banner ── */}
            <section className="py-10">
                <div className="container">
                    <div className="rounded-3xl p-8 text-white text-center relative overflow-hidden" style={{ background: 'var(--btn-gradient)' }}>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        <div className="relative z-10">
                            <div className="text-4xl mb-2">⭐</div>
                            <h2 className="text-2xl font-heading font-bold mb-2">Earn Points on Every Purchase!</h2>
                            <p className="opacity-90 mb-4">10 points per ₹100 spent · 2x during festivals · Redeem for discounts</p>
                            <Link to="/credits" className="inline-flex items-center gap-2 bg-white px-6 py-2.5 rounded-full font-bold transition-all hover:scale-105" style={{ color: 'rgb(var(--color-primary))' }}>
                                Learn More <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-12" style={{ background: 'rgba(var(--color-primary), 0.03)' }}>
                <div className="container">
                    <h2 className="text-2xl font-heading font-bold text-center mb-2">How It Works</h2>
                    <p className="text-center text-gray-500 mb-10">From discovery to celebration in 4 simple steps</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: '🔍', step: '01', title: 'Browse', desc: 'Explore 500+ handmade products from verified local sellers' },
                            { icon: '🤝', step: '02', title: 'Negotiate', desc: 'Use AI-powered chat to get the best price from sellers' },
                            { icon: '💳', step: '03', title: 'Pay', desc: 'Secure payment via UPI, Card, or Cash on Delivery' },
                            { icon: '🎉', step: '04', title: 'Celebrate', desc: 'Receive your order and earn credit points for next time' },
                        ].map(step => (
                            <div key={step.step} className="text-center">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-md" style={{ background: 'rgba(var(--color-primary), 0.1)' }}>
                                    {step.icon}
                                </div>
                                <div className="text-xs font-bold mb-1 opacity-40">{step.step}</div>
                                <h3 className="font-bold mb-1">{step.title}</h3>
                                <p className="text-sm text-gray-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Seller Testimonials ── */}
            <section className="py-12">
                <div className="container">
                    <h2 className="text-2xl font-heading font-bold text-center mb-2">Seller Stories</h2>
                    <p className="text-center text-gray-500 mb-8">Real sellers, real impact</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sellers.slice(0, 2).map(seller => (
                            <div key={seller.id} className="festival-card rounded-2xl p-6">
                                <div className="text-3xl mb-3">"</div>
                                <p className="text-gray-600 italic mb-4 line-clamp-3">{seller.story}</p>
                                <div className="flex items-center gap-3">
                                    <img src={seller.avatar} alt={seller.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-sm">{seller.name}</p>
                                        <p className="text-xs text-gray-500">{seller.business} · {seller.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Newsletter ── */}
            <section className="py-12" style={{ background: 'rgba(var(--color-primary), 0.03)' }}>
                <div className="container max-w-xl text-center">
                    <div className="text-4xl mb-3">📬</div>
                    <h2 className="text-2xl font-heading font-bold mb-2">Stay Festival-Ready</h2>
                    <p className="text-gray-500 mb-6">Get early access to festival deals, new seller stories, and exclusive offers.</p>
                    <form className="flex gap-2" onSubmit={e => { e.preventDefault(); alert('Thanks for subscribing! 🎉'); }}>
                        <input type="email" placeholder="your@email.com" required className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none font-body text-sm" />
                        <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: 'var(--btn-gradient)' }}>Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
