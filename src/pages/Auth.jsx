import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const passwordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
};

const Auth = ({ mode: initialMode }) => {
    const navigate = useNavigate();
    const { login, loginWithOTP, isAuthenticated } = useAuth();
    const { registerUser } = useData();
    const { showToast } = useNotifications();
    const { theme } = useTheme();

    const [mode, setMode] = useState(initialMode || 'login'); // login | register | otp
    const [role, setRole] = useState('customer');
    const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated]);

    const isDiwali = theme === 'diwali';
    const bgColor = isDiwali ? '#0D0221' : '#F9FAFB';
    const cardBg = isDiwali ? '#1a0a3a' : 'white';
    const textColor = isDiwali ? '#FFF8E7' : '#1F2937';
    const mutedColor = isDiwali ? 'rgba(255,248,231,0.6)' : '#6B7280';

    const validate = () => {
        const errs = {};
        if (mode === 'register') {
            if (!form.name.trim()) errs.name = 'Name is required';
            if (!form.email.includes('@')) errs.email = 'Valid email required';
            if (form.mobile.length !== 10) errs.mobile = '10-digit mobile required';
            if (form.password.length < 6) errs.password = 'Min 6 characters';
            if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        } else if (mode === 'login') {
            if (!form.email.includes('@')) errs.email = 'Valid email required';
            if (!form.password) errs.password = 'Password required';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const user = login(form.email, form.password);
            showToast(`Welcome back, ${user.name.split(' ')[0]}! 🎉`);
            navigate(user.role === 'admin' ? '/dashboard/admin' : user.role === 'seller' ? '/dashboard/seller' : '/');
        } catch (err) {
            setErrors({ general: err.message });
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const users = JSON.parse(localStorage.getItem('bizuplift_users') || '[]');
            if (users.find(u => u.email === form.email)) throw new Error('Email already registered');
            const newUser = registerUser({ name: form.name, email: form.email, mobile: form.mobile, password: form.password, role, avatar: `https://i.pravatar.cc/150?u=${Date.now()}` });
            login(form.email, form.password);
            showToast(`Welcome to BizUplift, ${form.name.split(' ')[0]}! You got 100 welcome points 🌟`);
            navigate(role === 'seller' ? '/dashboard/seller' : '/');
        } catch (err) {
            setErrors({ general: err.message });
        }
        setLoading(false);
    };

    const handleSendOTP = () => {
        if (form.mobile.length !== 10) { setErrors({ mobile: '10-digit mobile required' }); return; }
        setOtpSent(true);
        showToast('OTP sent to your mobile (demo: use 123456)');
    };

    const handleOTPLogin = (e) => {
        e.preventDefault();
        if (otp !== '123456') { setErrors({ otp: 'Invalid OTP. Demo OTP is 123456' }); return; }
        try {
            const user = loginWithOTP(form.mobile);
            showToast(`Welcome, ${user.name.split(' ')[0]}! 🎉`);
            navigate('/');
        } catch (err) {
            setErrors({ general: err.message });
        }
    };

    const pwdStrength = passwordStrength(form.password);
    const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

    const InputField = ({ icon: Icon, name, type = 'text', placeholder, value, onChange, error }) => (
        <div>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: mutedColor }} />
                <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border-2 text-sm outline-none transition-colors font-body"
                    style={{ background: isDiwali ? 'rgba(255,255,255,0.05)' : '#F9FAFB', borderColor: error ? '#EF4444' : isDiwali ? 'rgba(255,255,255,0.1)' : '#E5E7EB', color: textColor }}
                    onFocus={e => e.target.style.borderColor = 'rgb(var(--color-primary))'}
                    onBlur={e => e.target.style.borderColor = error ? '#EF4444' : isDiwali ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: bgColor }}>
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ background: cardBg }}>
                    {/* Header */}
                    <div className="p-8 text-center" style={{ background: 'var(--btn-gradient)' }}>
                        <div className="text-4xl mb-2">🛍️</div>
                        <h1 className="text-2xl font-heading font-bold text-white">BizUplift</h1>
                        <p className="text-white/70 text-sm">India's Festival Marketplace</p>
                    </div>

                    <div className="p-6">
                        {/* Mode tabs */}
                        <div className="flex rounded-xl overflow-hidden border mb-6" style={{ borderColor: isDiwali ? 'rgba(255,255,255,0.1)' : '#E5E7EB' }}>
                            {[['login', 'Sign In'], ['register', 'Register'], ['otp', 'OTP Login']].map(([m, label]) => (
                                <button key={m} onClick={() => { setMode(m); setErrors({}); }} className="flex-1 py-2.5 text-sm font-semibold transition-all" style={{ background: mode === m ? 'rgb(var(--color-primary))' : 'transparent', color: mode === m ? 'white' : mutedColor }}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        {errors.general && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">{errors.general}</div>}

                        {/* Login Form */}
                        {mode === 'login' && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <InputField icon={Mail} name="email" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
                                <div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: mutedColor }} />
                                        <input type={showPwd ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                            className="w-full pl-9 pr-10 py-3 rounded-xl border-2 text-sm outline-none font-body"
                                            style={{ background: isDiwali ? 'rgba(255,255,255,0.05)' : '#F9FAFB', borderColor: errors.password ? '#EF4444' : isDiwali ? 'rgba(255,255,255,0.1)' : '#E5E7EB', color: textColor }} />
                                        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: mutedColor }}>
                                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70" style={{ background: 'var(--btn-gradient)' }}>
                                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Sign In</>}
                                </button>
                                <div className="text-center text-xs" style={{ color: mutedColor }}>
                                    Demo: arjun@example.com / password123 · Admin: admin@bizuplift.com / admin123
                                </div>
                            </form>
                        )}

                        {/* Register Form */}
                        {mode === 'register' && (
                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* Role selector */}
                                <div className="flex gap-2">
                                    {[['customer', '🛍️ Customer'], ['seller', '🏪 Seller']].map(([r, label]) => (
                                        <button key={r} type="button" onClick={() => setRole(r)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all" style={{ background: role === r ? 'rgba(var(--color-primary), 0.1)' : 'transparent', borderColor: role === r ? 'rgb(var(--color-primary))' : isDiwali ? 'rgba(255,255,255,0.1)' : '#E5E7EB', color: role === r ? 'rgb(var(--color-primary))' : mutedColor }}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <InputField icon={User} name="name" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} />
                                <InputField icon={Mail} name="email" type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
                                <InputField icon={Phone} name="mobile" placeholder="Mobile number (10 digits)" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))} error={errors.mobile} />
                                <div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: mutedColor }} />
                                        <input type={showPwd ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                            className="w-full pl-9 pr-10 py-3 rounded-xl border-2 text-sm outline-none font-body"
                                            style={{ background: isDiwali ? 'rgba(255,255,255,0.05)' : '#F9FAFB', borderColor: isDiwali ? 'rgba(255,255,255,0.1)' : '#E5E7EB', color: textColor }} />
                                        <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: mutedColor }}>
                                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {form.password && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 mb-1">
                                                {[0, 1, 2, 3].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < pwdStrength ? strengthColors[pwdStrength - 1] : 'bg-gray-200'}`} />)}
                                            </div>
                                            <p className="text-xs" style={{ color: mutedColor }}>{strengthLabels[pwdStrength - 1] || 'Too short'}</p>
                                        </div>
                                    )}
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>
                                <InputField icon={Lock} name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} error={errors.confirmPassword} />
                                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70" style={{ background: 'var(--btn-gradient)' }}>
                                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Create Account</>}
                                </button>
                            </form>
                        )}

                        {/* OTP Login */}
                        {mode === 'otp' && (
                            <form onSubmit={handleOTPLogin} className="space-y-4">
                                <InputField icon={Phone} name="mobile" placeholder="Mobile number (10 digits)" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))} error={errors.mobile} />
                                {!otpSent ? (
                                    <button type="button" onClick={handleSendOTP} className="w-full py-3 rounded-xl font-bold text-white" style={{ background: 'var(--btn-gradient)' }}>
                                        Send OTP
                                    </button>
                                ) : (
                                    <>
                                        <div>
                                            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP (demo: 123456)" maxLength={6}
                                                className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none text-center tracking-widest font-mono"
                                                style={{ background: isDiwali ? 'rgba(255,255,255,0.05)' : '#F9FAFB', borderColor: errors.otp ? '#EF4444' : isDiwali ? 'rgba(255,255,255,0.1)' : '#E5E7EB', color: textColor }} />
                                            {errors.otp && <p className="text-xs text-red-500 mt-1">{errors.otp}</p>}
                                        </div>
                                        <button type="submit" className="w-full py-3 rounded-xl font-bold text-white" style={{ background: 'var(--btn-gradient)' }}>
                                            Verify & Login
                                        </button>
                                    </>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
