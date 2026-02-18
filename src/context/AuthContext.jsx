import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock JWT helpers
const createToken = (user) => {
    const payload = { userId: user.id, role: user.role, exp: Date.now() + 24 * 60 * 60 * 1000 };
    return btoa(JSON.stringify(payload));
};
const parseToken = (token) => {
    try { return JSON.parse(atob(token)); } catch { return null; }
};
const isTokenValid = (token) => {
    const payload = parseToken(token);
    return payload && payload.exp > Date.now();
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('bizuplift_token');
        const storedUser = localStorage.getItem('bizuplift_currentUser');
        if (storedToken && isTokenValid(storedToken) && storedUser) {
            setToken(storedToken);
            setCurrentUser(JSON.parse(storedUser));
        } else {
            localStorage.removeItem('bizuplift_token');
            localStorage.removeItem('bizuplift_currentUser');
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('bizuplift_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Invalid email or password');
        const newToken = createToken(user);
        setToken(newToken);
        setCurrentUser(user);
        localStorage.setItem('bizuplift_token', newToken);
        localStorage.setItem('bizuplift_currentUser', JSON.stringify(user));
        return user;
    };

    const loginWithOTP = (mobile) => {
        const users = JSON.parse(localStorage.getItem('bizuplift_users') || '[]');
        const user = users.find(u => u.mobile === mobile);
        if (!user) throw new Error('Mobile number not registered');
        const newToken = createToken(user);
        setToken(newToken);
        setCurrentUser(user);
        localStorage.setItem('bizuplift_token', newToken);
        localStorage.setItem('bizuplift_currentUser', JSON.stringify(user));
        return user;
    };

    const logout = () => {
        setToken(null);
        setCurrentUser(null);
        localStorage.removeItem('bizuplift_token');
        localStorage.removeItem('bizuplift_currentUser');
    };

    const updateCurrentUser = (updates) => {
        const updated = { ...currentUser, ...updates };
        setCurrentUser(updated);
        localStorage.setItem('bizuplift_currentUser', JSON.stringify(updated));
        // Also update in users array
        const users = JSON.parse(localStorage.getItem('bizuplift_users') || '[]');
        const updatedUsers = users.map(u => u.id === updated.id ? updated : u);
        localStorage.setItem('bizuplift_users', JSON.stringify(updatedUsers));
    };

    const isAuthenticated = !!currentUser && !!token;
    const isCustomer = currentUser?.role === 'customer';
    const isSeller = currentUser?.role === 'seller';
    const isAdmin = currentUser?.role === 'admin';

    return (
        <AuthContext.Provider value={{ currentUser, token, loading, isAuthenticated, isCustomer, isSeller, isAdmin, login, loginWithOTP, logout, updateCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
