import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Package, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNotifications } from '../context/NotificationContext';

const Confetti = () => {
    const colors = ['#FFD700', '#FF006E', '#06D6A0', '#E85D04', '#7C3AED', '#FF6B00'];
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="absolute animate-confetti-fall" style={{
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 20}px`,
                    width: `${6 + Math.random() * 8}px`,
                    height: `${6 + Math.random() * 8}px`,
                    background: colors[Math.floor(Math.random() * colors.length)],
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                }} />
            ))}
        </div>
    );
};

const Checkout = () => {
    const { cartItems, total, subtotal, couponAmount, creditsAmount, deliveryFee, clearCart } = useCart();
    const { currentUser } = useAuth();
    const { addOrder, addNotification, addCredits, redeemCredits } = useData();
    const { showToast, addNotification: addNotif } = useNotifications();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: address, 2: payment, 3: success
    const [address, setAddress] = useState({ name: currentUser?.name || '', line1: '', city: '', state: '', pincode: '', phone: currentUser?.mobile || '' });
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [upiId, setUpiId] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const STATES = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'];

    const handlePlaceOrder = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500)); // simulate processing
        const order = await addOrder({ customerId: currentUser.id, items: cartItems.map(i => ({ productId: i.productId, name: i.name, quantity: i.quantity, price: i.price, image: i.image })), total, paymentMethod, address });
        
        // Deduct spent credits
        if (creditsAmount > 0) {
            await redeemCredits(creditsAmount);
        }
        
        // Add newly earned credits (10% of total)
        const earnedPoints = Math.floor(total / 10);
        if (earnedPoints > 0) {
            await addCredits(currentUser.id, earnedPoints, `Earned from Order ${order?.id || ''}`);
        }
        setOrderId(order.id);
        clearCart();
        setShowConfetti(true);
        setStep(3);
        showToast('Order placed successfully! 🎉');
        addNotif(currentUser.id, { type: 'order', title: 'Order Placed!', body: `Your order ${order.id} has been placed. Estimated delivery: 4-6 days.` });
        setTimeout(() => setShowConfetti(false), 4000);
        setLoading(false);
    };

    if (!currentUser) { navigate('/auth'); return null; }
    if (cartItems.length === 0 && step !== 3) { navigate('/cart'); return null; }

    return (
        <div className="container py-6 pb-20 lg:pb-6 max-w-3xl">
            {showConfetti && <Confetti />}

            {/* Progress */}
            {step < 3 && (
                <div className="flex items-center gap-2 mb-8">
                    {['Address', 'Payment', 'Confirm'].map((s, i) => (
                        <div key={s} className="flex items-center gap-2 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'text-white' : 'bg-gray-200 text-gray-500'}`} style={step === i + 1 ? { background: 'rgb(var(--color-primary))' } : {}}>
                                {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-primary' : 'text-gray-400'}`}>{s}</span>
                            {i < 2 && <div className="flex-1 h-0.5 bg-gray-200" />}
                        </div>
                    ))}
                </div>
            )}

            {/* Step 1: Address */}
            {step === 1 && (
                <div className="festival-card rounded-2xl p-6">
                    <h2 className="font-bold text-xl mb-6">Delivery Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Full Name', key: 'name', placeholder: 'Arjun Mehta' },
                            { label: 'Phone', key: 'phone', placeholder: '9876543210' },
                            { label: 'Address Line', key: 'line1', placeholder: '42, Shanti Nagar', full: true },
                            { label: 'City', key: 'city', placeholder: 'Mumbai' },
                            { label: 'Pincode', key: 'pincode', placeholder: '400001' },
                        ].map(field => (
                            <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">{field.label}</label>
                                <input value={address[field.key]} onChange={e => setAddress(a => ({ ...a, [field.key]: e.target.value }))} placeholder={field.placeholder} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary font-body" />
                            </div>
                        ))}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">State</label>
                            <select value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none font-body">
                                <option value="">Select State</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={() => { if (Object.values(address).some(v => !v)) { showToast('Please fill all fields', 'error'); return; } setStep(2); }} className="mt-6 w-full py-3 rounded-xl font-bold text-white" style={{ background: 'var(--btn-gradient)' }}>
                        Continue to Payment
                    </button>
                </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
                <div className="space-y-4">
                    <div className="festival-card rounded-2xl p-6">
                        <h2 className="font-bold text-xl mb-6">Payment Method</h2>
                        <div className="space-y-3">
                            {[
                                { id: 'UPI', icon: <Smartphone className="w-5 h-5" />, label: 'UPI / QR Code', desc: 'Pay via PhonePe, GPay, Paytm' },
                                { id: 'Card', icon: <CreditCard className="w-5 h-5" />, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                                { id: 'COD', icon: <Package className="w-5 h-5" />, label: 'Cash on Delivery', desc: 'Pay when you receive' },
                            ].map(method => (
                                <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`} style={paymentMethod === method.id ? { borderColor: 'rgb(var(--color-primary))' } : {}}>
                                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="accent-primary" />
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg" style={{ background: 'rgba(var(--color-primary), 0.1)', color: 'rgb(var(--color-primary))' }}>{method.icon}</div>
                                        <div>
                                            <p className="font-semibold text-sm">{method.label}</p>
                                            <p className="text-xs text-gray-500">{method.desc}</p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {paymentMethod === 'UPI' && (
                            <div className="mt-4">
                                <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary" />
                            </div>
                        )}
                    </div>

                    {/* Order summary */}
                    <div className="festival-card rounded-2xl p-4">
                        <h3 className="font-bold mb-3">Order Summary</h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                            {couponAmount > 0 && <div className="flex justify-between text-green-600"><span>Coupon</span><span>-₹{couponAmount}</span></div>}
                            {creditsAmount > 0 && <div className="flex justify-between text-green-600"><span>Credits</span><span>-₹{creditsAmount}</span></div>}
                            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                            <hr className="my-2" />
                            <div className="flex justify-between font-bold text-base"><span>Total</span><span style={{ color: 'rgb(var(--color-primary))' }}>₹{total.toLocaleString()}</span></div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-sm">← Back</button>
                        <button onClick={handlePlaceOrder} disabled={loading} className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70" style={{ background: 'var(--btn-gradient)' }}>
                            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> : `Pay ₹${total.toLocaleString()}`}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce-once">🎉</div>
                    <h2 className="text-3xl font-heading font-bold mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-2">Order ID: <span className="font-mono font-bold">{orderId}</span></p>
                    <p className="text-gray-500 mb-8">You'll receive a confirmation shortly. Estimated delivery: 4-6 business days.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={() => navigate('/orders')} className="px-6 py-3 rounded-xl font-bold text-white" style={{ background: 'var(--btn-gradient)' }}>Track Order</button>
                        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-sm">Continue Shopping</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
