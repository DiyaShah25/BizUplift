import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Share2, Truck, Shield, MessageCircle, X, Send, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const NegotiationChat = ({ product, seller, onClose, onDeal }) => {
    const { theme } = useTheme();
    const { showToast } = useNotifications();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dealPrice, setDealPrice] = useState(null);
    const [roundCount, setRoundCount] = useState(0);
    const messagesEndRef = useRef(null);

    const isDiwali = theme === 'diwali';
    const FESTIVAL_EMOJIS = { diwali: '🪔', holi: '🎨', navratri: '💃', eid: '🌙', christmas: '🎄', rakhi: '🎀', onam: '🌸', lohri: '🔥', dussehra: '🏹', pongal: '🌾' };
    const festEmoji = FESTIVAL_EMOJIS[theme] || '🎊';

    const floorPrice = product.minPrice || Math.round(product.price * 0.75);
    const initialGreeting = `Namaste! ${festEmoji} Main hun ${seller?.business || 'BizUplift'} ki taraf se. Aapko "${product.name}" mein interest hai? Yeh ₹${product.price} mein listed hai — lekin festival season hai, toh baat karte hain! Aap kitna soch rahe hain?`;

    useEffect(() => {
        setMessages([{
            role: 'assistant',
            content: initialGreeting,
            timestamp: new Date()
        }]);
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const extractPrice = (text) => {
        const matches = text.match(/₹?\s*(\d{1,6})/g);
        if (matches) {
            const prices = matches.map(m => parseInt(m.replace(/[₹\s]/g, ''))).filter(p => p > 50 && p < 100000);
            return prices.length > 0 ? prices[0] : null;
        }
        return null;
    };

    const generateSellerResponse = (userText, round) => {
        const offeredPrice = extractPrice(userText);
        const currentFloor = floorPrice;
        const maxPrice = product.price;

        if (!offeredPrice) {
            const generalResponses = [
                `Arey, koi specific offer batao na! ${festEmoji} Yeh product ₹${maxPrice} ka hai, aap kitna soch rahe ho?`,
                `Haha, batao na kitna dena chahte ho! ${festEmoji} Main sunne ko ready hun.`,
                `Main samajh nahi paaya — kya price soch rahe ho aap? Ek number bolo! ${festEmoji}`,
            ];
            return { text: generalResponses[Math.floor(Math.random() * generalResponses.length)], deal: false };
        }

        if (offeredPrice >= maxPrice) {
            return {
                text: `Wah! ₹${maxPrice} se zyada? Aap toh bahut generous ho! ${festEmoji} Deal confirmed! ✅ Adding ₹${maxPrice} to your cart. Bohot shukriya!`,
                deal: true,
                price: maxPrice
            };
        }

        if (offeredPrice >= maxPrice * 0.95) {
            return {
                text: `Arre wah, bilkul sahi price! ${festEmoji} Deal confirmed! ✅ Adding ₹${offeredPrice} to your cart. Festival ki shubhkamnaayein!`,
                deal: true,
                price: offeredPrice
            };
        }

        if (offeredPrice >= currentFloor && round >= 2) {
            const finalPrice = Math.max(offeredPrice, currentFloor);
            return {
                text: `Theek hai bhai, aapke liye special! ${festEmoji} Deal confirmed! ✅ Adding ₹${finalPrice} to your cart. Itni achi baat-cheet ke baad mana kaise karun!`,
                deal: true,
                price: finalPrice
            };
        }

        if (offeredPrice >= currentFloor) {
            const counterPrice = Math.round((offeredPrice + maxPrice) * 0.5);
            const counterResponses = [
                `₹${offeredPrice}? Hmm, thoda kam hai... ${festEmoji} Yeh handmade product hai, bahut mehnat lagti hai! ₹${counterPrice} mein le lo, best price hai yeh!`,
                `Arre bhai, ₹${offeredPrice} mein toh material ka cost bhi nahi nikalta! 😅 Lekin festival hai, toh ₹${counterPrice} mein de sakta hun. Final offer!`,
                `Hmm, main samajhta hun budget tight hai. Lekin quality dekhiye! ${festEmoji} ₹${counterPrice} — is se kam mushkil hai. Deal karein?`,
            ];
            return { text: counterResponses[Math.floor(Math.random() * counterResponses.length)], deal: false };
        }

        if (offeredPrice < currentFloor * 0.7) {
            const tooLowResponses = [
                `Arre bhai, ₹${offeredPrice}?! 😱 Itne mein toh packaging bhi nahi aata! ${festEmoji} Seriously ₹${currentFloor + 50} se shuru karte hain. Yeh handmade hai, mass-produced nahi!`,
                `Haha, aap toh mazaak kar rahe ho! 😄 ₹${offeredPrice} mein toh kaam nahi chalega. ₹${currentFloor + 50} — yeh mera absolute minimum hai. ${festEmoji}`,
                `Nahi nahi, ₹${offeredPrice} bilkul possible nahi hai! ${festEmoji} Main ek free gift wrap add kar dunga ₹${currentFloor + 30} mein. Deal?`,
            ];
            return { text: tooLowResponses[Math.floor(Math.random() * tooLowResponses.length)], deal: false };
        }

        const lowResponses = [
            `₹${offeredPrice}... thoda aur badhao! ${festEmoji} ₹${Math.round((offeredPrice + maxPrice) * 0.45)} mein de sakta hun with free gift wrapping. Kya kehte ho?`,
            `Hmm, ₹${offeredPrice} mushkil hai lekin impossible nahi. ${festEmoji} ₹${currentFloor + Math.round((offeredPrice - currentFloor) * 0.3)} mein baat kar sakte hain agar aap 2 products lein!`,
            `Main chahta hun aapko de dun ₹${offeredPrice} mein, lekin seller bhi toh kamana chahta hai na! 😊 ₹${currentFloor + 20} — last price pakka. ${festEmoji}`,
        ];
        return { text: lowResponses[Math.floor(Math.random() * lowResponses.length)], deal: false };
    };

    const sendMessage = async (text) => {
        if (!text.trim() || loading || dealPrice) return;
        const userMsg = { role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const currentRound = roundCount + 1;
        setRoundCount(currentRound);

        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

        const response = generateSellerResponse(text, currentRound);
        const aiMsg = { role: 'assistant', content: response.text, timestamp: new Date() };
        setMessages(prev => [...prev, aiMsg]);

        if (response.deal && response.price) {
            setDealPrice(response.price);
            showToast(`Deal at ₹${response.price}! Saved ₹${product.price - response.price}`, 'success');
        }

        setLoading(false);
    };

    const quickOffers = [
        Math.round(product.price * 0.95),
        Math.round(product.price * 0.90),
        Math.round(product.price * 0.85),
        Math.round(product.price * 0.80),
    ].filter(p => p >= floorPrice);

    const chatBg = isDiwali ? '#0D0221' : '#F5F7FB';
    const bubbleBg = isDiwali ? 'rgba(255,215,0,0.1)' : '#F3F4F6';
    const bubbleText = isDiwali ? '#FFF8E7' : '#1F2937';

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
            <div className="w-full md:max-w-md md:rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '80vh', maxHeight: '600px', background: chatBg }}>
                <div className="flex items-center gap-3 p-4 border-b" style={{ background: 'var(--btn-gradient)', borderColor: 'transparent' }}>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm">🤝</div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm">AI Seller Agent</h3>
                        <p className="text-white/70 text-xs truncate">{seller?.business || 'BizUplift Seller'} · {product.name.slice(0, 25)}...</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/30 text-green-200 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Online
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white ml-1 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: chatBg }}>
                    <div className="text-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: isDiwali ? 'rgba(255,215,0,0.1)' : 'rgba(0,0,0,0.05)', color: isDiwali ? '#FFD700' : '#9CA3AF' }}>
                            Listed Price: ₹{product.price} · Floor: Negotiable
                        </span>
                    </div>
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'text-white rounded-2xl rounded-br-sm'
                                        : 'rounded-2xl rounded-bl-sm'
                                    }`}
                                style={
                                    msg.role === 'user'
                                        ? { background: 'var(--btn-gradient)' }
                                        : { background: bubbleBg, color: bubbleText }
                                }
                            >
                                {msg.content}
                                <div className="text-[10px] opacity-50 mt-1 text-right">
                                    {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: bubbleBg }}>
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'rgb(var(--color-primary))', animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {dealPrice && (
                    <div className="px-4 py-3" style={{ background: isDiwali ? 'rgba(16,185,129,0.15)' : '#F0FDF4', borderTop: isDiwali ? '1px solid rgba(16,185,129,0.3)' : '1px solid #BBF7D0' }}>
                        <button
                            onClick={() => { onDeal(dealPrice); onClose(); }}
                            className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                        >
                            🎉 Add to Cart at ₹{dealPrice}
                            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                Saved ₹{product.price - dealPrice}
                            </span>
                        </button>
                    </div>
                )}

                {!dealPrice && quickOffers.length > 0 && (
                    <div className="px-4 py-2" style={{ borderTop: isDiwali ? '1px solid rgba(255,215,0,0.15)' : '1px solid #E5E7EB' }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: isDiwali ? 'rgba(255,248,231,0.4)' : '#9CA3AF' }}>Quick offers:</p>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {quickOffers.map(price => (
                                <button
                                    key={price}
                                    onClick={() => sendMessage(`I'd like to offer ₹${price} for this.`)}
                                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95"
                                    style={{
                                        border: '1.5px solid rgb(var(--color-primary))',
                                        color: isDiwali ? '#FFD700' : 'rgb(var(--color-primary))',
                                        background: isDiwali ? 'rgba(255,215,0,0.1)' : 'transparent',
                                    }}
                                >
                                    ₹{price}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {!dealPrice && (
                    <div className="p-3 flex gap-2" style={{ borderTop: isDiwali ? '1px solid rgba(255,215,0,0.15)' : '1px solid #E5E7EB', background: isDiwali ? 'rgba(13,2,33,0.95)' : '#FFFFFF' }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                            placeholder="Type your offer or message..."
                            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none font-body"
                            style={{
                                border: isDiwali ? '1px solid rgba(255,215,0,0.3)' : '1px solid #E5E7EB',
                                background: isDiwali ? 'rgba(255,215,0,0.05)' : '#F9FAFB',
                                color: isDiwali ? '#FFF8E7' : '#1F2937',
                            }}
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={loading || !input.trim()}
                            className="p-2.5 rounded-xl text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
                            style={{ background: 'var(--btn-gradient)' }}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, sellers, getProductReviews, isWishlisted, toggleWishlist, addReview } = useData();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const { showToast } = useNotifications();
    const { theme } = useTheme();

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [chatOpen, setChatOpen] = useState(false);
    const [negotiatedPrice, setNegotiatedPrice] = useState(null);
    const [pincode, setPincode] = useState('');
    const [delivery, setDelivery] = useState('');
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [imageHover, setImageHover] = useState(false);

    const isDiwali = theme === 'diwali';
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
        showToast(`Deal! Added at ₹${price}. Saved ₹${product.price - price}!`);
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
        showToast('Review submitted! You earned 50 credit points');
    };

    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating;

    return (
        <div className="container py-6 pb-20 lg:pb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
                <span>/</span>
                <span style={{ color: isDiwali ? '#FFF8E7' : '#1F2937' }} className="line-clamp-1">{product.name}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-10">
                <div>
                    <div
                        className="relative aspect-square rounded-2xl overflow-hidden mb-3 group"
                        style={{
                            perspective: '1000px',
                            background: isDiwali ? 'rgba(20,5,50,0.5)' : '#F3F4F6',
                        }}
                        onMouseEnter={() => setImageHover(true)}
                        onMouseLeave={() => setImageHover(false)}
                    >
                        <img
                            src={product.images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-700"
                            style={{
                                transform: imageHover
                                    ? 'scale(1.06) rotateY(2deg) rotateX(-1deg)'
                                    : 'scale(1) rotateY(0) rotateX(0)',
                                transformStyle: 'preserve-3d',
                            }}
                        />
                        <div
                            className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background: imageHover
                                    ? 'linear-gradient(135deg, rgba(var(--color-primary),0.08), transparent, rgba(var(--color-primary),0.05))'
                                    : 'transparent',
                                opacity: imageHover ? 1 : 0,
                            }}
                        />
                        {product.images.length > 1 && (
                            <>
                                <button onClick={() => setActiveImage(i => (i - 1 + product.images.length) % product.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><ChevronLeft className="w-4 h-4" /></button>
                                <button onClick={() => setActiveImage(i => (i + 1) % product.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><ChevronRight className="w-4 h-4" /></button>
                            </>
                        )}
                        {negotiatedPrice && (
                            <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5">
                                🤝 Negotiated! Saved ₹{product.price - negotiatedPrice}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {product.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className="w-16 h-16 rounded-xl overflow-hidden transition-all duration-300"
                                style={{
                                    border: activeImage === i ? '2px solid rgb(var(--color-primary))' : '2px solid transparent',
                                    transform: activeImage === i ? 'scale(1.08)' : 'scale(1)',
                                    boxShadow: activeImage === i ? 'var(--shadow-card)' : 'none',
                                }}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white mb-3" style={{ background: 'rgb(var(--color-primary))' }}>
                        🎪 {product.festival} Special
                    </span>

                    <h1 className="text-2xl font-heading font-bold mb-3">{product.name}</h1>

                    <Link to={`/seller/${product.sellerId}`} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                        <img src={seller?.avatar || `https://i.pravatar.cc/40?u=${product.sellerId}`} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="text-sm font-semibold">{product.sellerName}</p>
                            <p className="text-xs text-gray-500">{seller?.city} · {seller?.verified && '✓ Verified'}</p>
                        </div>
                    </Link>

                    <div className="festival-card rounded-2xl p-4 mb-4">
                        <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-3xl font-bold" style={{ color: 'rgb(var(--color-primary))' }}>₹{displayPrice}</span>
                            {product.mrp > product.price && <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>}
                            {savingsPct > 0 && !negotiatedPrice && <span className="text-sm font-bold text-green-600">Save {savingsPct}%</span>}
                        </div>
                        {negotiatedPrice && <p className="text-sm text-green-600 font-semibold">🤝 Negotiated price! Original: ₹{product.price}</p>}
                        {product.negotiable && !negotiatedPrice && <p className="text-sm text-green-600">🤝 This product is negotiable — chat to get a better price!</p>}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}
                        </div>
                        <span className="font-bold">{avgRating}</span>
                        <span className="text-sm text-gray-500">({reviews.length || product.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium">{product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}</span>
                        {product.stock < 10 && product.stock > 0 && <span className="text-xs text-red-500 font-semibold">Only {product.stock} remaining!</span>}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden" style={{ borderColor: isDiwali ? 'rgba(255,215,0,0.3)' : undefined }}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors"><Minus className="w-4 h-4" /></button>
                            <span className="px-4 py-2 font-bold text-sm">{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mb-4">
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                                style={{ background: 'var(--btn-gradient)' }}
                            >
                                <ShoppingBag className="w-4 h-4" /> Add to Cart
                            </button>
                            <button
                                onClick={() => currentUser ? toggleWishlist(currentUser.id, product.id) : navigate('/auth')}
                                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${wishlisted ? 'bg-red-50 border-red-200' : 'border-gray-200'}`}
                            >
                                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </button>
                            <button
                                onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!'); }}
                                className="p-3 rounded-xl border-2 border-gray-200 hover:scale-105 transition-all"
                            >
                                <Share2 className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        {product.negotiable && (
                            <button
                                onClick={() => setChatOpen(true)}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                                style={{
                                    borderColor: 'rgb(var(--color-primary))',
                                    color: 'rgb(var(--color-primary))',
                                    background: isDiwali ? 'rgba(255,215,0,0.05)' : 'transparent',
                                }}
                            >
                                <MessageCircle className="w-4 h-4 group-hover:animate-bounce" /> 🤝 Negotiate Price
                            </button>
                        )}
                    </div>

                    <div className="festival-card rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">Check Delivery</span>
                        </div>
                        <div className="flex gap-2">
                            <input value={pincode} onChange={e => setPincode(e.target.value.slice(0, 6))} placeholder="Enter pincode" className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none" style={{ background: isDiwali ? 'rgba(255,215,0,0.05)' : undefined, borderColor: isDiwali ? 'rgba(255,215,0,0.2)' : undefined, color: isDiwali ? '#FFF8E7' : undefined }} />
                            <button onClick={handlePincode} className="px-3 py-1.5 rounded-lg text-white text-sm font-bold" style={{ background: 'rgb(var(--color-primary))' }}>Check</button>
                        </div>
                        {delivery && <p className="text-xs text-green-600 mt-1 font-medium">✓ {delivery}</p>}
                    </div>

                    <div className="flex gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-green-500" /> Secure Payment</div>
                        <div className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-blue-500" /> Free over ₹999</div>
                        <div className="flex items-center gap-1">🔄 Easy Returns</div>
                    </div>
                </div>
            </div>

            <div className="festival-card rounded-2xl p-6 mb-6">
                <h2 className="font-bold text-lg mb-3">Product Description</h2>
                <p className="text-gray-600 leading-relaxed" style={{ color: isDiwali ? 'rgba(255,248,231,0.7)' : undefined }}>{product.description}</p>
                {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {product.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: isDiwali ? 'rgba(255,215,0,0.1)' : '#F3F4F6', color: isDiwali ? '#FFD700' : '#6B7280' }}>#{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="festival-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg">Reviews ({reviews.length})</h2>
                    <button onClick={() => setShowReviewForm(!showReviewForm)} className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: 'var(--btn-gradient)' }}>
                        Write a Review
                    </button>
                </div>

                {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="mb-6 p-4 rounded-xl" style={{ background: isDiwali ? 'rgba(255,215,0,0.05)' : '#F9FAFB' }}>
                        <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                                    <Star className={`w-6 h-6 transition-colors ${s <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
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
                        <div key={review.id} className="border-b pb-4 last:border-0" style={{ borderColor: isDiwali ? 'rgba(255,215,0,0.1)' : '#F3F4F6' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                                <span className="font-semibold text-sm">{review.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1" style={{ color: isDiwali ? 'rgba(255,248,231,0.6)' : undefined }}>{review.body}</p>
                            <p className="text-xs text-gray-400">{review.userName} · {new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {chatOpen && <NegotiationChat product={product} seller={seller} onClose={() => setChatOpen(false)} onDeal={handleDeal} />}
        </div>
    );
};

export default ProductDetail;
