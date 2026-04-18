import { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus, X, Image, Send } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const POST_TYPES = ['All', 'review', 'tip', 'seller_story'];
const FESTIVALS_FILTER = ['All', 'Diwali', 'Holi', 'Navratri', 'Eid', 'Christmas', 'Onam', 'Lohri'];

const Community = () => {
    const { posts, addPost, toggleLike } = useData();
    const { currentUser } = useAuth();
    const { showToast } = useNotifications();
    const [activeType, setActiveType] = useState('All');
    const [activeFestival, setActiveFestival] = useState('All');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPost, setNewPost] = useState({ type: 'review', festival: 'Diwali', content: '' });

    const filtered = posts.filter(p => {
        if (activeType !== 'All' && p.type !== activeType) return false;
        if (activeFestival !== 'All' && p.festival !== activeFestival) return false;
        return true;
    });

    const handleLike = (postId) => {
        if (!currentUser) { showToast('Sign in to like posts', 'info'); return; }
        toggleLike(postId, currentUser.id);
    };

    const handleCreatePost = () => {
        if (!currentUser) { showToast('Sign in to post', 'info'); return; }
        if (!newPost.content.trim()) { showToast('Write something!', 'error'); return; }
        addPost({ ...newPost, authorId: currentUser.id, authorName: currentUser.name, authorAvatar: currentUser.avatar, image: null });
        setNewPost({ type: 'review', festival: 'Diwali', content: '' });
        setShowCreatePost(false);
        showToast('Post shared! You earned 25 credit points 🌟');
    };

    const typeLabels = { review: '⭐ Review', tip: '💡 Tip', seller_story: '🏪 Seller Story' };
    const typeColors = { review: 'bg-blue-100 text-blue-700', tip: 'bg-green-100 text-green-700', seller_story: 'bg-orange-100 text-orange-700' };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (d > 0) return `${d}d ago`;
        if (h > 0) return `${h}h ago`;
        return 'Just now';
    };

    return (
        <div className="container py-6 pb-20 lg:pb-6 max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-heading font-bold">Community</h1>
                    <p className="text-sm text-gray-500">Share reviews, tips & seller stories</p>
                </div>
                <button onClick={() => setShowCreatePost(true)} className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white text-sm" style={{ background: 'var(--btn-gradient)' }}>
                    <Plus className="w-4 h-4" /> Post
                </button>
            </div>

            {/* Create Post Modal */}
            {showCreatePost && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4">
                    <div className="w-full md:max-w-lg bg-white md:rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold">Create Post</h3>
                            <button onClick={() => setShowCreatePost(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="flex gap-2 mb-3">
                            {['review', 'tip', 'seller_story'].map(type => (
                                <button key={type} onClick={() => setNewPost(p => ({ ...p, type }))} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${newPost.type === type ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={newPost.type === type ? { background: 'rgb(var(--color-primary))' } : {}}>
                                    {typeLabels[type]}
                                </button>
                            ))}
                        </div>
                        <select value={newPost.festival} onChange={e => setNewPost(p => ({ ...p, festival: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-3 outline-none">
                            {FESTIVALS_FILTER.filter(f => f !== 'All').map(f => <option key={f}>{f}</option>)}
                        </select>
                        <textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} placeholder="Share your experience, tip, or story..." rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none resize-none mb-3" />
                        <div className="flex gap-2">
                            <button onClick={() => setShowCreatePost(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
                            <button onClick={handleCreatePost} className="flex-1 py-2 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2" style={{ background: 'var(--btn-gradient)' }}>
                                <Send className="w-4 h-4" /> Share
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="space-y-2 mb-6">
                <div className="flex gap-2 overflow-x-auto">
                    {POST_TYPES.map(type => (
                        <button key={type} onClick={() => setActiveType(type)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeType === type ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={activeType === type ? { background: 'rgb(var(--color-primary))' } : {}}>
                            {type === 'All' ? 'All Posts' : typeLabels[type]}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {FESTIVALS_FILTER.map(f => (
                        <button key={f} onClick={() => setActiveFestival(f)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeFestival === f ? 'text-white border-transparent' : 'border-gray-200 text-gray-600'}`} style={activeFestival === f ? { background: 'rgb(var(--color-primary))' } : {}}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {filtered.map(post => (
                    <div key={post.id} className="festival-card rounded-2xl overflow-hidden">
                        {post.image && <img src={post.image} alt="" className="w-full h-48 object-cover" loading="lazy" />}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <img src={post.authorAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{post.authorName}</p>
                                    <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${typeColors[post.type] || 'bg-gray-100 text-gray-600'}`}>{typeLabels[post.type]}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(var(--color-primary), 0.1)', color: 'rgb(var(--color-primary))' }}>{post.festival}</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.content}</p>
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${currentUser && post.likedBy.includes(currentUser.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                                    <Heart className={`w-4 h-4 ${currentUser && post.likedBy.includes(currentUser.id) ? 'fill-current' : ''}`} />
                                    <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{post.comments}</span>
                                </button>
                                <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied!'); }} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-400 transition-colors ml-auto">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
