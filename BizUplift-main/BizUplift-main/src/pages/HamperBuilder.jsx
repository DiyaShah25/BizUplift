import { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, Gift, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

const HAMPER_THEMES = [
    { id: 'diwali', name: 'Diwali Hamper', emoji: '🪔', color: '#FFD700', desc: 'Diyas, sweets & decor' },
    { id: 'holi', name: 'Holi Hamper', emoji: '🎨', color: '#FF006E', desc: 'Colors, gulal & gifts' },
    { id: 'wedding', name: 'Wedding Hamper', emoji: '💍', color: '#E85D04', desc: 'Traditional & premium' },
    { id: 'corporate', name: 'Corporate Gift', emoji: '🎁', color: '#7C3AED', desc: 'Professional & elegant' },
];

const HamperBuilder = () => {
    const { products } = useData();
    const { addToCart } = useCart();
    const { showToast } = useNotifications();
    const [selectedTheme, setSelectedTheme] = useState(HAMPER_THEMES[0]);
    const [hamperItems, setHamperItems] = useState([]);
    const [recipientName, setRecipientName] = useState('');
    const [personalMessage, setPersonalMessage] = useState('');
    const [budget, setBudget] = useState(2000);

    const suggestedProducts = products.filter(p => p.festival.toLowerCase() === selectedTheme.id || p.festival === 'All').slice(0, 8);
    const hamperTotal = hamperItems.reduce((s, item) => s + item.price * item.qty, 0);

    const addToHamper = (product) => {
        setHamperItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromHamper = (id) => setHamperItems(prev => prev.filter(i => i.id !== id));
    const updateQty = (id, qty) => {
        if (qty < 1) { removeFromHamper(id); return; }
        setHamperItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    };

    const handleAddAllToCart = () => {
        if (hamperItems.length === 0) { showToast('Add items to your hamper first!', 'error'); return; }
        hamperItems.forEach(item => addToCart(item, item.qty));
        showToast(`🎁 Hamper with ${hamperItems.length} items added to cart!`);
    };

    return (
        <div className="container py-6 pb-20 lg:pb-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold mb-2">🎁 Hamper Builder</h1>
                <p className="text-gray-500">Create the perfect festival gift hamper for your loved ones</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Builder Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Theme Selection */}
                    <div className="festival-card rounded-2xl p-5">
                        <h2 className="font-bold mb-3">1. Choose Hamper Theme</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {HAMPER_THEMES.map(theme => (
                                <button key={theme.id} onClick={() => setSelectedTheme(theme)} className={`p-3 rounded-xl border-2 text-center transition-all ${selectedTheme.id === theme.id ? 'border-primary scale-105' : 'border-gray-200'}`} style={selectedTheme.id === theme.id ? { borderColor: theme.color, background: `${theme.color}15` } : {}}>
                                    <div className="text-2xl mb-1">{theme.emoji}</div>
                                    <div className="text-xs font-bold">{theme.name}</div>
                                    <div className="text-xs text-gray-500">{theme.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="festival-card rounded-2xl p-5">
                        <h2 className="font-bold mb-3">2. Set Budget</h2>
                        <input type="range" min={500} max={10000} step={100} value={budget} onChange={e => setBudget(+e.target.value)} className="w-full accent-primary mb-2" />
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">₹500</span>
                            <span className="font-bold text-lg" style={{ color: 'rgb(var(--color-primary))' }}>₹{budget.toLocaleString()}</span>
                            <span className="text-gray-500">₹10,000</span>
                        </div>
                    </div>

                    {/* Product Selection */}
                    <div className="festival-card rounded-2xl p-5">
                        <h2 className="font-bold mb-3">3. Add Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {suggestedProducts.map(product => (
                                <button key={product.id} onClick={() => addToHamper(product)} className="text-left rounded-xl overflow-hidden border-2 border-gray-100 hover:border-primary transition-all hover:scale-105 group">
                                    <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover" />
                                    <div className="p-2">
                                        <p className="text-xs font-semibold line-clamp-1">{product.name}</p>
                                        <p className="text-xs font-bold" style={{ color: 'rgb(var(--color-primary))' }}>₹{product.price}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Personalization */}
                    <div className="festival-card rounded-2xl p-5">
                        <h2 className="font-bold mb-3">4. Personalize</h2>
                        <div className="space-y-3">
                            <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Recipient's name" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none" />
                            <textarea value={personalMessage} onChange={e => setPersonalMessage(e.target.value)} placeholder="Personal message (will be printed on gift card)..." rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none resize-none" />
                        </div>
                    </div>
                </div>

                {/* Hamper Summary */}
                <div>
                    <div className="festival-card rounded-2xl p-5 sticky top-20">
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">{selectedTheme.emoji}</div>
                            <h3 className="font-bold">{selectedTheme.name}</h3>
                            {recipientName && <p className="text-sm text-gray-500">For: {recipientName}</p>}
                        </div>

                        {hamperItems.length === 0 ? (
                            <div className="text-center py-6 text-gray-400">
                                <Gift className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Add items to build your hamper</p>
                            </div>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {hamperItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-2">
                                        <img src={item.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500">₹{item.price} × {item.qty}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                                            <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t pt-3 mb-4">
                            <div className="flex justify-between font-bold">
                                <span>Hamper Total</span>
                                <span style={{ color: hamperTotal > budget ? '#EF4444' : 'rgb(var(--color-primary))' }}>₹{hamperTotal.toLocaleString()}</span>
                            </div>
                            {hamperTotal > budget && <p className="text-xs text-red-500 mt-1">⚠️ Over budget by ₹{(hamperTotal - budget).toLocaleString()}</p>}
                        </div>

                        <button onClick={handleAddAllToCart} disabled={hamperItems.length === 0} className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: 'var(--btn-gradient)' }}>
                            <ShoppingBag className="w-4 h-4" /> Add Hamper to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HamperBuilder;
