import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { ShoppingBag, Star, MapPin, Check } from 'lucide-react';

const FESTIVALS_DATA = [
    { id: 'diwali', name: 'Diwali', emoji: '🪔', date: 'Oct 20, 2025', desc: 'Festival of Lights — Celebrate with diyas, rangoli, sweets, and fireworks. Shop exclusive Diwali hampers, decorations, and traditional gifts.', color: '#FFD700', bg: '#0D0221', category: 'Candles & Diyas' },
    { id: 'holi', name: 'Holi', emoji: '🎨', date: 'Mar 14, 2025', desc: 'Festival of Colors — Celebrate with organic gulal, pichkaris, and traditional sweets. Find the best Holi gifts and accessories.', color: '#FF006E', bg: '#FFF0F5', category: 'Decoration' },
    { id: 'navratri', name: 'Navratri', emoji: '💃', date: 'Oct 2, 2025', desc: 'Festival of Dance — Nine nights of garba, dandiya, and devotion. Shop traditional chaniya choli, dandiya sticks, and accessories.', color: '#7C3AED', bg: '#F5F0FF', category: 'Clothing' },
    { id: 'eid', name: 'Eid', emoji: '🌙', date: 'Mar 31, 2025', desc: 'Festival of Joy — Celebrate Eid with traditional attire, sweets, and gifts for your loved ones.', color: '#06D6A0', bg: '#F0FFF8', category: 'Food & Sweets' },
    { id: 'christmas', name: 'Christmas', emoji: '🎄', date: 'Dec 25, 2025', desc: 'Festival of Giving — Spread joy with Christmas gifts, decorations, and handmade crafts from local artisans.', color: '#E85D04', bg: '#FFF5F0', category: 'Decoration' },
    { id: 'onam', name: 'Onam', emoji: '🌸', date: 'Sep 5, 2025', desc: 'Harvest Festival of Kerala — Celebrate with traditional pookalam flowers, kasavu sarees, and authentic Kerala sweets.', color: '#FFD700', bg: '#FFFDF0', category: 'Clothing' },
];

const Festivals = () => {
    const { products } = useData();
    const { setTheme } = useTheme();
    const { addToCart } = useCart();
    const { showToast } = useNotifications();

    return (
        <div className="container py-6 pb-20 lg:pb-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-heading font-bold mb-2">🎪 Festival Calendar</h1>
                <p className="text-gray-500">Discover curated products for every Indian festival</p>
            </div>

            <div className="space-y-8">
                {FESTIVALS_DATA.map(festival => {
                    const festProducts = products.filter(p => p.festival.toLowerCase() === festival.id || p.festival === 'All').slice(0, 4);
                    return (
                        <div key={festival.id} className="festival-card rounded-3xl overflow-hidden">
                            {/* Festival Header */}
                            <div className="p-6 flex items-center gap-4" style={{ background: festival.bg }}>
                                <div className="text-5xl">{festival.emoji}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-heading font-bold">{festival.name}</h2>
                                        <span className="text-sm text-gray-500">📅 {festival.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 max-w-xl">{festival.desc}</p>
                                </div>
                                <button onClick={() => { setTheme(festival.id); showToast(`${festival.emoji} ${festival.name} theme activated!`); }} className="flex-shrink-0 px-4 py-2 rounded-full text-white text-sm font-bold" style={{ background: festival.color }}>
                                    Apply Theme
                                </button>
                            </div>

                            {/* Products */}
                            {festProducts.length > 0 && (
                                <div className="p-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {festProducts.map(product => (
                                            <Link key={product.id} to={`/product/${product.id}`} className="group">
                                                <div className="rounded-xl overflow-hidden border border-gray-100 hover:border-primary transition-all hover:shadow-md">
                                                    <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    <div className="p-2">
                                                        <p className="text-xs font-semibold line-clamp-1">{product.name}</p>
                                                        <p className="text-xs font-bold" style={{ color: festival.color }}>₹{product.price}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link to={`/marketplace?festival=${festival.name}`} className="inline-block mt-3 text-sm font-semibold" style={{ color: festival.color }}>
                                        View all {festival.name} products →
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Festivals;
