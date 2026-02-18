import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Share2, Truck, Shield, MessageCircle, X, Send, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

// ─── AI Negotiation Chat ─────────────────────────────────────────────────────
const NegotiationChat = ({ product, seller, onClose, onDeal }) => {
    const { theme } = useTheme();
    const { currentUser } = useAuth();
    const { showToast } = useNotifications();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dealPrice, setDealPrice] = useState(null);
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('bizuplift_apikey') || '');
    const [showApiInput, setShowApiInput] = useState(!localStorage.getItem('bizuplift_apikey'));
    const messagesEndRef = useRef(null);

    const FESTIVAL_EMOJIS = { diwali: '🪔', holi: '🎨', navratri: '💃', default: '🎊' };
    const festEmoji = FESTIVAL_EMOJIS[theme] || FESTIVAL_EMOJIS.default;

    useEffect(() => {
        if (!showApiInput) {
            setMessages([{
                role: 'assistant',
                content: `Namaste! ${festEmoji} Main hun ${seller?.business || 'BizUplift'} ki taraf se. Aapko "${product.name}" mein interest hai? Hamare paas yeh ₹${product.price} mein available hai. Kya aap koi offer karna chahenge? 😊`,
                timestamp: new Date()
            }]);
        }
    }, [showApiInput]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const systemPrompt = `You are an AI seller agent representing a small Indian seller on BizUplift marketplace.
You are negotiating the price of: "${product.name}"
Original price: ₹${product.price}
Minimum acceptable price (floor): ₹${product.minPrice} (never reveal this exact number)
Maximum discount allowed: ${product.maxDiscount}%
Seller name: ${seller?.business || 'BizUplift Seller'}
Festival context: This is a ${product.festival} special product.

Your personality: Warm, friendly, slightly stubborn but fair. You speak in a mix of Hindi and English (Hinglish).
You represent a small local seller who has worked hard on these products.
You can offer discounts up to the floor price only.
If customer goes below floor price, politely decline and offer something else (combo deal, free gift, etc.)
Never break character. Never reveal you are an AI unless directly asked.
Keep responses short (2-3 sentences max).
Use festive emojis relevant to ${product.festival}.
After agreeing on a price, say exactly: "Deal confirmed! ✅ Adding ₹[PRICE] to your cart." where [PRICE] is the agreed number.`;

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;
        const userMsg = { role: 'user', content: text, timestamp: new Date() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        // Check for deal in previous AI message
        const lastAI = messages.filter(m => m.role === 'assistant').pop();
        if (lastAI?.content.includes('Deal confirmed!')) {
            setLoading(false);
            return;
        }

        try {
            const key = apiKey || localStorage.getItem('bizuplift_apikey');
            if (!key) { setShowApiInput(true); setLoading(false); return; }

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
                body: JSON.stringify({
                    model: 'claude-opus-4-5',
                    max_tokens: 200,
                    system: systemPrompt,
                    messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            if (!response.ok) {
                if (response.status === 401) { setShowApiInput(true); showToast('Invalid API key. Please re-enter.', 'error'); }
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.content[0].text;
            const aiMsg = { role: 'assistant', content: aiText, timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);

            // Check if deal was confirmed
            const dealMatch = aiText.match(/Deal confirmed!.*?₹(\d+)/);
            if (dealMatch) {
                const agreedPrice = parseInt(dealMatch[1]);
                setDealPrice(agreedPrice);
                showToast(`🎉 Deal at ₹${agreedPrice}! Saved ₹${product.price - agreedPrice}`, 'success');
            }
        } catch (err) {
            // Fallback mock response
            const mockResponses = [
                `Hmm, yeh thoda kam hai bhai! ${festEmoji} Lekin aapke liye ₹${Math.max(product.minPrice, Math.round(product.price * 0.9))} mein de sakta hun. Kya lagta hai?`,
                `Arre, itna discount nahi ho sakta! 😅 Yeh handmade product hai, bahut mehnat lagti hai. ₹${Math.max(product.minPrice, Math.round(product.price * 0.88))} final offer hai.`,
                `Theek hai, aapke liye special festival discount! ${festEmoji} ₹${Math.max(product.minPrice, Math.round(product.price * 0.85))} mein le lo. Aur kya chahiye?`,
            ];
            const mockMsg = { role: 'assistant', content: mockResponses[Math.floor(Math.random() * mockResponses.length)], timestamp: new Date() };
            setMessages(prev => [...prev, mockMsg]);
            showToast('Using demo mode (no API key)', 'info');
        }
        setLoading(false);
    };

    const quickOffers = [
        Math.round(product.price * 0.95),
        Math.round(product.price * 0.90),
        Math.round(product.price * 0.85),
        Math.round(product.price * 0.80),
    ].filter(p => p >= product.minPrice);

    if (showApiInput) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                    <h3 className="font-bold text-lg mb-2">🤖 Enable AI Negotiation</h3>
                    <p className="text-sm text-gray-500 mb-4">Enter your Anthropic API key to chat with the AI seller agent. Your key is stored locally only.</p>
                    <input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm mb-3 outline-none focus:border-primary font-mono" />
                    <div className="flex gap-2">
                        <button onClick={() => { localStorage.setItem('bizuplift_apikey', apiKey); setShowApiInput(false); }} className="flex-1 py-2 rounded-xl text-white font-bold text-sm" style={{ background: 'var(--btn-gradient)' }}>Save & Continue</button>
                        <button onClick={() => { setShowApiInput(false); }} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium">Use Demo Mode</button>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
            <div className="w-full md:max-w-md bg-white md:rounded-2xl shadow-2xl flex flex-col" style={{ height: '80vh', maxHeight: '600px' }}>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b" style={{ background: 'var(--btn-gradient)' }}>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🤝</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">AI Seller Agent</h3>
                        <p className="text-white/70 text-xs">{seller?.business || 'BizUplift Seller'} · Negotiating: {product.name.slice(0, 25)}...</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}
                                style={msg.role === 'user' ? { background: 'var(--btn-gradient)' } : {}}>
                                {msg.content}
                                <div className="text-xs opacity-50 mt-1">{msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Deal button */}
                {dealPrice && (
                    <div className="px-4 py-2 bg-green-50 border-t border-green-200">
                        <button onClick={() => { onDeal(dealPrice); onClose(); }} className="w-full py-2.5 rounded-xl bg-green-500 text-white font-bold text-sm">
                            🎉 Add to Cart at ₹{dealPrice} (Saved ₹{product.price - dealPrice})
                        </button>
                    </div>
                )}

                {/* Quick offers */}
                {!dealPrice && quickOffers.length > 0 && (
                    <div className="px-4 py-2 border-t">
                        <p className="text-xs text-gray-400 mb-2">Quick offers:</p>
                        <div className="flex gap-2 overflow-x-auto">
                            {quickOffers.map(price => (
                                <button key={price} onClick={() => sendMessage(`I'd like to offer ₹${price} for this product.`)} className="flex-shrink-0 px-3 py-1 rounded-full border text-xs font-semibold hover:bg-primary/10 transition-colors" style={{ borderColor: 'rgb(var(--color-primary))', color: 'rgb(var(--color-primary))' }}>
                                    ₹{price}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-3 border-t flex gap-2">
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                        placeholder="Make an offer or ask a question..." className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary font-body" />
                    <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className="p-2 rounded-xl text-white disabled:opacity-50" style={{ background: 'var(--btn-gradient)' }}>
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main ProductDetail ───────────────────────────────────────────────────────
const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, sellers, getProductReviews, isWishlisted, toggleWishlist, addReview } = useData();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const { showToast } = useNotifications();

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [chatOpen, setChatOpen] = useState(false);
    const [negotiatedPrice, setNegotiatedPrice] = useState(null);
    const [pincode, setPincode] = useState('');
    const [delivery, setDelivery] = useState('');
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
    const [showReviewForm, setShowReviewForm] = useState(false);

    const product = products.find(p => p.id === id);
    const seller = product ? sellers.find(s => s.id === product.sellerId) : null;
    const reviews = product ? getProductReviews(product.id) : [];
    const wishlisted = currentUser && product ? isWishlisted(currentUser.id, product.id) : false;

    if (!product) return (
        <div className="container py-20 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <Link to="/marketplace" className="text-primary hover:underline">Back to Marketplace</Link>
        </div>
    );

    const savings = product.mrp - product.price;
    const savingsPct = Math.round((savings / product.mrp) * 100);
    const displayPrice = negotiatedPrice || product.price;

    const handleAddToCart = () => {
        addToCart(product, quantity, negotiatedPrice);
        showToast(`Added ${quantity}x ${product.name.slice(0, 25)}... to cart!`);
    };

    const handleDeal = (price) => {
        setNegotiatedPrice(price);
        addToCart(product, quantity, price);
        showToast(`🎉 Deal! Added at ₹${price}. Saved ₹${product.price - price}!`);
    };

    const handlePincode = () => {
        if (pincode.length === 6) setDelivery(`Estimated delivery: ${new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) { navigate('/auth'); return; }
        addReview({ ...reviewForm, productId: product.id, userId: currentUser.id, userName: currentUser.name });
        setShowReviewForm(false);
        setReviewForm({ rating: 5, title: '', body: '' });
        showToast('Review submitted! You earned 50 credit points 🌟');
    };

    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating;

    return (
        <div className="container py-6 pb-20 lg:pb-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
                <span>/</span>
                <span className="text-gray-800 line-clamp-1">{product.name}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-10">
                {/* Image Gallery */}
                <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 group">
                        <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {product.images.length > 1 && (
                            <>
                                <button onClick={() => setActiveImage(i => (i - 1 + product.images.length) % product.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"><ChevronLeft className="w-4 h-4" /></button>
                                <button onClick={() => setActiveImage(i => (i + 1) % product.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"><ChevronRight className="w-4 h-4" /></button>
                            </>
                        )}
                        {negotiatedPrice && (
                            <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                🤝 Negotiated! Saved ₹{product.price - negotiatedPrice}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {product.images.map((img, i) => (
                            <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary scale-105' : 'border-transparent'}`} style={activeImage === i ? { borderColor: 'rgb(var(--color-primary))' } : {}}>
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Panel */}
                <div>
                    {/* Festival badge */}
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ background: 'rgb(var(--color-primary))' }}>
                        🎪 {product.festival} Special
                    </span>

                    <h1 className="text-2xl font-heading font-bold mb-3">{product.name}</h1>

                    {/* Seller */}
                    <Link to={`/seller/${product.sellerId}`} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                        <img src={seller?.avatar || `https://i.pravatar.cc/40?u=${product.sellerId}`} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="text-sm font-semibold">{product.sellerName}</p>
                            <p className="text-xs text-gray-500">{seller?.city} · {seller?.verified && '✓ Verified'}</p>
                        </div>
                    </Link>

                    {/* Price */}
                    <div className="festival-card rounded-2xl p-4 mb-4">
                        <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-3xl font-bold" style={{ color: 'rgb(var(--color-primary))' }}>₹{displayPrice}</span>
                            {product.mrp > product.price && <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>}
                            {savingsPct > 0 && !negotiatedPrice && <span className="text-sm font-bold text-green-600">Save {savingsPct}%</span>}
                        </div>
                        {negotiatedPrice && <p className="text-sm text-green-600 font-semibold">🤝 Negotiated price! Original: ₹{product.price}</p>}
                        {product.negotiable && !negotiatedPrice && <p className="text-sm text-green-600">🤝 This product is negotiable — chat to get a better price!</p>}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}
                        </div>
                        <span className="font-bold">{avgRating}</span>
                        <span className="text-sm text-gray-500">({reviews.length || product.reviews} reviews)</span>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium">{product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}</span>
                        {product.stock < 10 && product.stock > 0 && <span className="text-xs text-red-500 font-semibold">⚡ Only {product.stock} remaining!</span>}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                            <span className="px-4 py-2 font-bold text-sm">{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 mb-4">
                        <div className="flex gap-3">
                            <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02]" style={{ background: 'var(--btn-gradient)' }}>
                                <ShoppingBag className="w-4 h-4" /> Add to Cart
                            </button>
                            <button onClick={() => currentUser ? toggleWishlist(currentUser.id, product.id) : navigate('/auth')} className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${wishlisted ? 'bg-red-50 border-red-200' : 'border-gray-200'}`}>
                                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </button>
                            <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!'); }} className="p-3 rounded-xl border-2 border-gray-200 hover:scale-105 transition-all">
                                <Share2 className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        {product.negotiable && (
                            <button onClick={() => setChatOpen(true)} className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all hover:scale-[1.02]" style={{ borderColor: 'rgb(var(--color-primary))', color: 'rgb(var(--color-primary))' }}>
                                <MessageCircle className="w-4 h-4" /> 🤝 Negotiate Price with AI
                            </button>
                        )}
                    </div>

                    {/* Delivery estimator */}
                    <div className="festival-card rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">Check Delivery</span>
                        </div>
                        <div className="flex gap-2">
                            <input value={pincode} onChange={e => setPincode(e.target.value.slice(0, 6))} placeholder="Enter pincode" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none" />
                            <button onClick={handlePincode} className="px-3 py-1.5 rounded-lg text-white text-sm font-bold" style={{ background: 'rgb(var(--color-primary))' }}>Check</button>
                        </div>
                        {delivery && <p className="text-xs text-green-600 mt-1 font-medium">✓ {delivery}</p>}
                    </div>

                    {/* Trust badges */}
                    <div className="flex gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-green-500" /> Secure Payment</div>
                        <div className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-blue-500" /> Free over ₹999</div>
                        <div className="flex items-center gap-1">🔄 Easy Returns</div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="festival-card rounded-2xl p-6 mb-6">
                <h2 className="font-bold text-lg mb-3">Product Description</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {product.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews */}
            <div className="festival-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg">Reviews ({reviews.length})</h2>
                    <button onClick={() => setShowReviewForm(!showReviewForm)} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'var(--btn-gradient)' }}>
                        Write a Review
                    </button>
                </div>

                {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                                    <Star className={`w-6 h-6 ${s <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>
                        <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} placeholder="Review title" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 outline-none" />
                        <textarea value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} placeholder="Share your experience..." required rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 outline-none resize-none" />
                        <button type="submit" className="px-6 py-2 rounded-lg text-white text-sm font-bold" style={{ background: 'var(--btn-gradient)' }}>Submit Review</button>
                    </form>
                )}

                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-6">No reviews yet. Be the first to review!</p>
                    ) : reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                                <span className="font-semibold text-sm">{review.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{review.body}</p>
                            <p className="text-xs text-gray-400">{review.userName} · {new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Chat Modal */}
            {chatOpen && <NegotiationChat product={product} seller={seller} onClose={() => setChatOpen(false)} onDeal={handleDeal} />}
        </div>
    );
};

export default ProductDetail;
