import React, { useState, useEffect, useRef } from 'react';
import { Bell, Trash2, Clock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './NotificationBell.css';

const NotificationBell = ({ userRole }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const isFirstLoad = useRef(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            
            if (isFirstLoad.current) {
                setNotifications(res.data);
                isFirstLoad.current = false;
                return;
            }

            setNotifications(prev => {
                // Find notifications that are in res.data but not in prev
                const newNotifs = res.data.filter(n => !prev.find(old => old._id === n._id));
                newNotifs.forEach(n => {
                    if (!n.isRead) toast(n.message, { icon: '🔔' });
                });
                return res.data;
            });
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    useEffect(() => {
        if (!userRole) return;
        fetchNotifications();

        // Polling for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [userRole]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unread = notifications.filter(n => !n.isRead);
            await Promise.all(unread.map(n => api.put(`/notifications/${n._id}/read`)));
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setShowNotifications(false);
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="notification-wrapper">
            <button className="nav-icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
                <div className="notif-dropdown">
                    <div className="notif-header">
                        <h4>Notifications</h4>
                        <div className="notif-count-pill">{unreadCount} New</div>
                    </div>
                    <div className="notif-body">
                        {loading && notifications.length === 0 ? (
                            <p className="no-notif">Loading...</p>
                        ) : notifications.length > 0 ? (
                            notifications.map(n => (
                                <div
                                    key={n._id}
                                    className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                                    onClick={() => !n.isRead && markAsRead(n._id)}
                                >
                                    <div className="notif-content">
                                        <p>{n.message}</p>
                                        <div className="notif-time-flex">
                                            <Clock size={12} />
                                            <span>{formatTime(n.createdAt)}</span>
                                        </div>
                                    </div>
                                    {!n.isRead && <span className="unread-dot"></span>}
                                </div>
                            ))
                        ) : (
                            <div className="empty-notif-state">
                                <Bell size={40} color="#e2e8f0" />
                                <p>No new notifications</p>
                            </div>
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="notif-footer">
                            <button onClick={markAllAsRead}>Mark all as read</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
