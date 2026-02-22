import React, { useState, useEffect, useContext } from 'react';
import { notificationsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (user) {
            loadNotifications();
            // Poll every 30 seconds
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const data = await notificationsAPI.getAll({ limit: 5, unreadOnly: 'true' });
            setUnreadCount(data.unreadCount || 0);
            setNotifications(data.notifications || []);
        } catch (err) {
            // Silent fail for notification polling
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationsAPI.markAllRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
        } catch (err) {
            // Silent fail
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, readStatus: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            // Silent fail
        }
    };

    if (!user) return null;

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
                    padding: '0.5rem', fontSize: '1.3rem', color: 'var(--text)'
                }}
                title="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: 0, right: 0, background: 'var(--danger, #ef4444)',
                        color: '#fff', borderRadius: '50%', width: '18px', height: '18px',
                        fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowDropdown(false)} />
                    <div style={{
                        position: 'absolute', right: 0, top: '100%', width: '320px', maxHeight: '400px',
                        overflowY: 'auto', background: 'var(--surface, #fff)', border: '1px solid var(--border, #e5e7eb)',
                        borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 100
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                            <strong>Notifications</strong>
                            {unreadCount > 0 && (
                                <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}>
                                    Mark all read
                                </button>
                            )}
                        </div>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No new notifications
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div key={n._id}
                                    onClick={() => !n.readStatus && handleMarkRead(n._id)}
                                    style={{
                                        padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
                                        cursor: 'pointer', background: n.readStatus ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                                        transition: 'background 0.2s'
                                    }}>
                                    <div style={{ fontWeight: n.readStatus ? 400 : 600, fontSize: '0.85rem' }}>{n.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        {n.message?.substring(0, 80)}{n.message?.length > 80 ? '...' : ''}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
