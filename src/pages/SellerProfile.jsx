import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Package, ShoppingBag, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

const SellerProfile = () => {
    const { id } = useParams();
    const { sellers, products } = useData();
    const { addToCart } = useCart();
    const { showToast } = useNotifications();

    const seller = sellers.find(s => s.id === id);
    const sellerProducts = products.filter(p => p.sellerId === id);

    if (!seller) return (
        <div className="container py-20 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold mb-2">Seller not found</h2>
            <Link to="/marketplace" className="text-primary hover:underline">Back to Marketplace</Link>
        </div>
    );

    return (
        <div className="container py-6 pb-20 lg:pb-6">
            {/* Hero */}
            <div className="festival-card rounded-3xl overflow-hidden mb-6">
                <div className="h-32 w-full" style={{ background: 'var(--btn-gradient)' }} />
                <div className="px-6 pb-6">
                    <div className="flex items-end gap-4 -mt-10 mb-4">
                        <img src={seller.avatar} alt={seller.name} className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-lg" />
                        <div className="pb-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-heading font-bold">{seller.business}</h1>
                                {seller.verified && <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold"><Check className="w-3 h-3" /> Verified</span>}
                            </div>
                            <p className="text-sm text-gray-500">{seller.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {seller.city}, {seller.state}</span>
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {seller.rating} ({seller.totalOrders} orders)</span>
                        <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {sellerProducts.length} products</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{seller.story}</p>
                </div>
            </div>

            {/* Products */}
            <h2 className="font-bold text-xl mb-4">Products by {seller.business}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sellerProducts.map(product => (
                    <div key={product.id} className="festival-card rounded-2xl overflow-hidden group">
                        <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </Link>
                        <div className="p-3">
                            <Link to={`/product/${product.id}`}><h3 className="font-semibold text-sm line-clamp-2 mb-1 hover:text-primary">{product.name}</h3></Link>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm" style={{ color: 'rgb(var(--color-primary))' }}>₹{product.price}</span>
                                <button onClick={() => { addToCart(product); showToast(`${product.name.slice(0, 20)}... added!`); }} className="p-1.5 rounded-lg text-white" style={{ background: 'var(--btn-gradient)' }}>
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerProfile;
