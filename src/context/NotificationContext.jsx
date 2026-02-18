import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

const SEED_NOTIFICATIONS = [
    { id: 'n1', userId: 'c1', type: 'order', title: 'Order Shipped!', body: 'Your order ORD002 has been shipped. Expected delivery: 3-5 days.', read: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'n2', userId: 'c1', type: 'credits', title: 'Credits Earned!', body: 'You earned 94 credit points from your last purchase.', read: false, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'n3', userId: 'c1', type: 'community', title: 'New reply on your post', body: 'Priya Sharma replied to your community post.', read: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'n4', userId: 'c1', type: 'promo', title: '🪔 Diwali Sale is LIVE!', body: 'Up to 30% off on all Diwali products. Use code DIWALI15.', read: true, createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
];

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState({});
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('bizuplift_notifications');
        if (stored) {
            setNotifications(JSON.parse(stored));
        } else {
            const seed = { c1: SEED_NOTIFICATIONS };
            setNotifications(seed);
            localStorage.setItem('bizuplift_notifications', JSON.stringify(seed));
        }
    }, []);

    const persist = (data) => {
        setNotifications(data);
        localStorage.setItem('bizuplift_notifications', JSON.stringify(data));
    };

    const getUserNotifications = (userId) => notifications[userId] || [];

    const getUnreadCount = (userId) => getUserNotifications(userId).filter(n => !n.read).length;

    const addNotification = useCallback((userId, notification) => {
        const userNotifs = notifications[userId] || [];
        const newNotif = { ...notification, id: `n${Date.now()}`, read: false, createdAt: new Date().toISOString() };
        persist({ ...notifications, [userId]: [newNotif, ...userNotifs] });
    }, [notifications]);

    const markRead = (userId, notifId) => {
        const updated = { ...notifications, [userId]: getUserNotifications(userId).map(n => n.id === notifId ? { ...n, read: true } : n) };
        persist(updated);
    };

    const markAllRead = (userId) => {
        const updated = { ...notifications, [userId]: getUserNotifications(userId).map(n => ({ ...n, read: true })) };
        persist(updated);
    };

    const clearAll = (userId) => {
        persist({ ...notifications, [userId]: [] });
    };

    // Toast system
    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <NotificationContext.Provider value={{
            notifications, toasts,
            getUserNotifications, getUnreadCount,
            addNotification, markRead, markAllRead, clearAll,
            showToast, dismissToast,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
