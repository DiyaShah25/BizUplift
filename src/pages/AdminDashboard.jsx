import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, ShoppingBag, TrendingUp, Check, X, Eye, Shield, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNotifications } from '../context/NotificationContext';

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const { users, products, orders, sellers, updateUser } = useData();
    const { showToast } = useNotifications();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [broadcast, setBroadcast] = useState('');

    if (!currentUser || currentUser.role !== 'admin') { navigate('/'); return null; }

    const stats = [
        { label: 'Total Users', value: users.length, icon: '👥', color: '#7C3AED' },
        { label: 'Total Products', value: products.length, icon: '📦', color: '#E85D04' },
        { label: 'Total Orders', value: orders.length, icon: '🛒', color: '#06D6A0' },
        { label: 'Total Revenue', value: `₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}`, icon: '💰', color: '#FFD700' },
    ];

    const revenueData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
        month, revenue: Math.floor(Math.random() * 50000) + 20000, orders: Math.floor(Math.random() * 100) + 30,
    }));

    const TABS = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'users', label: '👥 Users' },
        { id: 'sellers', label: '🏪 Sellers' },
        { id: 'products', label: '📦 Products' },
        { id: 'broadcast', label: '📢 Broadcast' },
    ];

    return (
        <div className="container py-6 pb-20 lg:pb-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--btn-gradient)' }}>🛡️</div>
                <div>
                    <h1 className="text-xl font-heading font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">BizUplift Control Panel</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto mb-6">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab.id ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={activeTab === tab.id ? { background: 'rgb(var(--color-primary))' } : {}}>
                        {tab.label}
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
                    <div className="festival-card rounded-2xl p-5">
                        <h3 className="font-bold mb-4">Platform Revenue (Last 6 Months)</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                                <Bar dataKey="revenue" fill="rgb(var(--color-primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="festival-card rounded-2xl p-4">
                            <h3 className="font-bold mb-3">Recent Orders</h3>
                            {orders.slice(0, 4).map(o => (
                                <div key={o.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
                                    <span className="font-mono">{o.id}</span>
                                    <span className="font-bold" style={{ color: 'rgb(var(--color-primary))' }}>₹{o.total}</span>
                                </div>
                            ))}
                        </div>
                        <div className="festival-card rounded-2xl p-4">
                            <h3 className="font-bold mb-3">User Breakdown</h3>
                            {[['Customers', users.filter(u => u.role === 'customer').length, '#06D6A0'], ['Sellers', users.filter(u => u.role === 'seller').length, '#E85D04'], ['Admins', users.filter(u => u.role === 'admin').length, '#7C3AED']].map(([label, count, color]) => (
                                <div key={label} className="flex items-center gap-3 py-2">
                                    <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                                    <span className="text-sm flex-1">{label}</span>
                                    <span className="font-bold text-sm">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
                <div>
                    <h3 className="font-bold mb-4">All Users ({users.length})</h3>
                    <div className="space-y-2">
                        {users.map(user => (
                            <div key={user.id} className="festival-card rounded-xl p-3 flex items-center gap-3">
                                <img src={user.avatar || `https://i.pravatar.cc/40?u=${user.id}`} alt="" className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'seller' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span>
                                <span className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sellers */}
            {activeTab === 'sellers' && (
                <div>
                    <h3 className="font-bold mb-4">Seller Verification ({sellers.length})</h3>
                    <div className="space-y-3">
                        {sellers.map(seller => (
                            <div key={seller.id} className="festival-card rounded-2xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={seller.avatar} alt="" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">{seller.business}</p>
                                        <p className="text-xs text-gray-500">{seller.name} · {seller.city}, {seller.state}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${seller.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {seller.verified ? '✓ Verified' : 'Pending'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{seller.story}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>⭐ {seller.rating}</span>
                                    <span>📦 {seller.products} products</span>
                                    <span>🛒 {seller.totalOrders} orders</span>
                                    {!seller.verified && (
                                        <button onClick={() => { showToast(`${seller.business} verified! ✓`); }} className="ml-auto flex items-center gap-1 px-3 py-1 rounded-full bg-green-500 text-white font-bold">
                                            <Check className="w-3 h-3" /> Verify
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
                <div>
                    <h3 className="font-bold mb-4">All Products ({products.length})</h3>
                    <div className="space-y-2">
                        {products.map(product => (
                            <div key={product.id} className="festival-card rounded-xl p-3 flex items-center gap-3">
                                <img src={product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.sellerName} · {product.festival}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm" style={{ color: 'rgb(var(--color-primary))' }}>₹{product.price}</p>
                                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Broadcast */}
            {activeTab === 'broadcast' && (
                <div className="max-w-lg">
                    <div className="festival-card rounded-2xl p-6">
                        <h3 className="font-bold text-lg mb-4">📢 Broadcast Notification</h3>
                        <p className="text-sm text-gray-500 mb-4">Send a notification to all users on the platform.</p>
                        <textarea value={broadcast} onChange={e => setBroadcast(e.target.value)} placeholder="Enter your message... e.g. 🪔 Diwali Sale is LIVE! Up to 30% off on all products." rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none resize-none mb-3" />
                        <div className="flex gap-2">
                            <select className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none">
                                <option>All Users</option>
                                <option>Customers Only</option>
                                <option>Sellers Only</option>
                            </select>
                            <button onClick={() => { if (broadcast.trim()) { showToast(`Broadcast sent to all users! 📢`); setBroadcast(''); } }} className="px-6 py-2 rounded-xl text-white font-bold text-sm" style={{ background: 'var(--btn-gradient)' }}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
