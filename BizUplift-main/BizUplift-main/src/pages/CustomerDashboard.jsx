import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, Star, MapPin, Edit3, Check, X, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNotifications } from '../context/NotificationContext';

const CustomerDashboard = () => {
    const { currentUser, updateCurrentUser, logout } = useAuth();
    const { orders, getUserCredits, wishlists } = useData();
    const { showToast } = useNotifications();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [editMode, setEditMode] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', mobile: currentUser?.mobile || '' });
    const [addresses, setAddresses] = useState([
        { id: 'a1', label: 'Home', name: currentUser?.name, line1: '42, Shanti Nagar', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: currentUser?.mobile, isDefault: true },
    ]);

    if (!currentUser) { navigate('/auth'); return null; }

    const userOrders = orders.filter(o => o.customerId === (currentUser.id || currentUser._id));
    const userCredits = getUserCredits(currentUser.id);
    const wishlistCount = (wishlists[currentUser.id] || []).length;

    const stats = [
        { label: 'Total Orders', value: userOrders.length, icon: '📦', color: '#E85D04' },
        { label: 'Credit Points', value: userCredits.balance, icon: '⭐', color: '#FFD700' },
        { label: 'Wishlist Items', value: wishlistCount, icon: '❤️', color: '#FF006E' },
        { label: 'Total Spent', value: `₹${userOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}`, icon: '💰', color: '#06D6A0' },
    ];

    const handleSaveProfile = () => {
        updateCurrentUser(profileForm);
        setEditMode(false);
        showToast('Profile updated successfully!');
    };

    const TABS = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'orders', label: 'Orders', icon: '📦' },
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'addresses', label: 'Addresses', icon: '📍' },
        { id: 'credits', label: 'Credits', icon: '⭐' },
    ];

    return (
        <div className="container py-6 pb-20 lg:pb-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <img src={currentUser.avatar || `https://i.pravatar.cc/80?u=${currentUser.id}`} alt="" className="w-16 h-16 rounded-full object-cover border-4" style={{ borderColor: 'rgb(var(--color-primary))' }} />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white" />
                </div>
                <div>
                    <h1 className="text-xl font-heading font-bold">Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto mb-6">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab.id ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={activeTab === tab.id ? { background: 'rgb(var(--color-primary))' } : {}}>
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map(stat => (
                            <div key={stat.label} className="festival-card rounded-2xl p-4 text-center">
                                <div className="text-3xl mb-1">{stat.icon}</div>
                                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                                <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 className="font-bold mb-3">Recent Orders</h3>
                        {userOrders.slice(0, 3).map(order => (
                            <div key={order.id} className="festival-card rounded-xl p-4 mb-2 flex items-center justify-between">
                                <div>
                                    <p className="font-mono text-sm font-bold">{order.id}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                                    <span className="font-bold text-sm" style={{ color: 'rgb(var(--color-primary))' }}>₹{order.total}</span>
                                </div>
                            </div>
                        ))}
                        <Link to="/orders" className="text-sm font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>View all orders →</Link>
                    </div>
                </div>
            )}

            {/* Orders tab */}
            {activeTab === 'orders' && (
                <div>
                    {userOrders.length === 0 ? <p className="text-center py-10 text-gray-500">No orders yet</p> : userOrders.map(order => (
                        <div key={order.id} className="festival-card rounded-2xl p-4 mb-3">
                            <div className="flex justify-between mb-2">
                                <span className="font-mono text-sm font-bold">{order.id}</span>
                                <span className="font-bold" style={{ color: 'rgb(var(--color-primary))' }}>₹{order.total}</span>
                            </div>
                            <div className="flex gap-2 mb-2">
                                {order.items.map(item => <img key={item.productId} src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />)}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                                <span className={`font-bold ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Profile tab */}
            {activeTab === 'profile' && (
                <div className="festival-card rounded-2xl p-6 max-w-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">Personal Information</h3>
                        <button onClick={() => editMode ? handleSaveProfile() : setEditMode(true)} className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>
                            {editMode ? <><Check className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[['Full Name', 'name'], ['Email', 'email'], ['Mobile', 'mobile']].map(([label, key]) => (
                            <div key={key}>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                                {editMode ? (
                                    <input value={profileForm[key]} onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary" />
                                ) : (
                                    <p className="text-sm font-medium">{currentUser[key]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Addresses tab */}
            {activeTab === 'addresses' && (
                <div className="space-y-3 max-w-lg">
                    {addresses.map(addr => (
                        <div key={addr.id} className="festival-card rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-sm">{addr.label}</span>
                                {addr.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>}
                            </div>
                            <p className="text-sm text-gray-600">{addr.name}</p>
                            <p className="text-sm text-gray-600">{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-sm text-gray-600">{addr.phone}</p>
                        </div>
                    ))}
                    <button className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-primary hover:text-primary transition-colors">
                        + Add New Address
                    </button>
                </div>
            )}

            {/* Credits tab */}
            {activeTab === 'credits' && (
                <div className="max-w-lg">
                    <div className="festival-card rounded-2xl p-6 text-center mb-4" style={{ background: 'var(--btn-gradient)' }}>
                        <div className="text-4xl mb-2">⭐</div>
                        <div className="text-4xl font-bold text-white">{userCredits.balance}</div>
                        <div className="text-white/70 text-sm">Credit Points = ₹{userCredits.balance} value</div>
                    </div>
                    <div className="festival-card rounded-2xl p-4">
                        <h3 className="font-bold mb-3">Transaction History</h3>
                        {(userCredits.transactions || []).map(tx => (
                            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium">{tx.action}</p>
                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                </div>
                                <span className={`font-bold text-sm ${tx.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                                    {tx.type === 'earn' ? '+' : ''}{tx.points} pts
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
