import { Link } from 'react-router-dom';
import { Star, Gift, TrendingUp, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const HOW_TO_EARN = [
    { emoji: '🛒', action: 'Make a Purchase', points: '₹1 = 1 point', desc: 'Earn points on every order' },
    { emoji: '⭐', action: 'Write a Review', points: '50 points', desc: 'Share your experience' },
    { emoji: '📝', action: 'Community Post', points: '25 points', desc: 'Post tips, stories & reviews' },
    { emoji: '👥', action: 'Refer a Friend', points: '200 points', desc: 'When they make first purchase' },
    { emoji: '🎂', action: 'Birthday Bonus', points: '100 points', desc: 'On your birthday month' },
    { emoji: '🆕', action: 'Welcome Bonus', points: '100 points', desc: 'Just for signing up' },
];

const HOW_TO_REDEEM = [
    { emoji: '💰', action: 'Cart Discount', desc: 'Use up to 10% of order value as discount', min: 100 },
    { emoji: '🚚', action: 'Free Delivery', desc: 'Redeem 50 points for free delivery', min: 50 },
    { emoji: '🎁', action: 'Exclusive Products', desc: 'Unlock special credit-only products', min: 500 },
];
import { useState, useEffect } from 'react';

const Credits = () => {
    const { currentUser } = useAuth();
    const { getUserCredits } = useData();
    const [userCredits, setUserCredits] = useState({ balance: 0, transactions: [] });

    useEffect(() => {
        if (currentUser) {
            getUserCredits(currentUser.id).then(data => {
                // The API returns { success: true, balance: X, transactions: [...] }
                if (data) {
                    setUserCredits({ 
                        balance: data.balance || 0, 
                        transactions: data.transactions || [] 
                    });
                }
            }).catch(() => {
                setUserCredits({ balance: 0, transactions: [] });
            });
        }
    }, [currentUser, getUserCredits]);

    return (
        <div className="container py-6 pb-20 lg:pb-6 max-w-3xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold mb-2">⭐ BizUplift Credits</h1>
                <p className="text-gray-500">Earn points, save money, unlock rewards</p>
            </div>

            {/* Balance Card */}
            {currentUser ? (
                <div className="rounded-3xl p-8 text-center text-white mb-8" style={{ background: 'var(--btn-gradient)' }}>
                    <div className="text-6xl font-bold mb-2">{userCredits.balance}</div>
                    <div className="text-white/70 text-lg">Credit Points</div>
                    <div className="text-white/50 text-sm mt-1">= ₹{userCredits.balance} value</div>
                    <Link to="/cart" className="inline-block mt-4 px-6 py-2 bg-white/20 rounded-full text-sm font-bold hover:bg-white/30 transition-colors">
                        Redeem in Cart →
                    </Link>
                </div>
            ) : (
                <div className="festival-card rounded-3xl p-8 text-center mb-8">
                    <div className="text-5xl mb-3">⭐</div>
                    <h3 className="font-bold text-xl mb-2">Start Earning Credits</h3>
                    <p className="text-gray-500 mb-4">Sign in to track your points and redeem rewards</p>
                    <Link to="/auth" className="inline-block px-6 py-3 rounded-full font-bold text-white" style={{ background: 'var(--btn-gradient)' }}>Sign In</Link>
                </div>
            )}

            {/* How to Earn */}
            <div className="festival-card rounded-2xl p-6 mb-6">
                <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> How to Earn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {HOW_TO_EARN.map(item => (
                        <div key={item.action} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                            <div className="text-2xl">{item.emoji}</div>
                            <div>
                                <p className="font-semibold text-sm">{item.action}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                            <span className="ml-auto text-xs font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{item.points}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* How to Redeem */}
            <div className="festival-card rounded-2xl p-6 mb-6">
                <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><Gift className="w-5 h-5" /> How to Redeem</h2>
                <div className="space-y-3">
                    {HOW_TO_REDEEM.map(item => (
                        <div key={item.action} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                            <div className="text-3xl">{item.emoji}</div>
                            <div className="flex-1">
                                <p className="font-semibold">{item.action}</p>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <span className="text-xs text-gray-400">Min: {item.min} pts</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction History */}
            {currentUser && userCredits.transactions?.length > 0 && (
                <div className="festival-card rounded-2xl p-6">
                    <h2 className="font-bold text-xl mb-4">Transaction History</h2>
                    <div className="space-y-2">
                        {userCredits.transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium">{tx.action}</p>
                                    <p className="text-xs text-gray-400">{tx.date}</p>
                                </div>
                                <span className={`font-bold text-sm ${tx.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                                    {tx.type === 'earn' ? '+' : '-'}{tx.points} pts
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Credits;
