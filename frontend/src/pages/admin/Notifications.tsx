import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { notificationsAPI } from '../../services/api';

const AdminNotifications = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [sending, setSending] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationsAPI.getAll({ limit: 50 });
            setHistory(data.notifications || []);
        } catch (err) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleSendAnnouncement = async (e) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) {
            toast.error('Title and message are required');
            return;
        }
        try {
            setSending(true);
            const payload = { title: title.trim(), message: message.trim() };
            if (targetRole) payload.targetRole = targetRole;
            const data = await notificationsAPI.sendAnnouncement(payload);
            toast.success(`Announcement sent to ${data.recipientCount} users`);
            setTitle('');
            setMessage('');
            setTargetRole('');
            loadNotifications();
        } catch (err) {
            toast.error(err.message || 'Failed to send announcement');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="page-container">
            <h1>Notifications & Announcements</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2>Send Announcement</h2>
                <form onSubmit={handleSendAnnouncement}>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Announcement title" maxLength={200} required />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)}
                            placeholder="Write your announcement..." rows={4} maxLength={1000} required />
                    </div>
                    <div className="form-group">
                        <label>Target Audience</label>
                        <select value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                            <option value="">All Users</option>
                            <option value="resident">Residents Only</option>
                            <option value="employee">Employees Only</option>
                            <option value="special-employee">Special Employees Only</option>
                            <option value="admin">Admins Only</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={sending}>
                        {sending ? 'Sending...' : 'Send Announcement'}
                    </button>
                </form>
            </div>

            <div className="card">
                <h2>Notification History</h2>
                {loading ? (
                    <p className="text-muted">Loading...</p>
                ) : history.length === 0 ? (
                    <p className="text-muted">No notifications yet</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(notif => (
                                    <tr key={notif._id}>
                                        <td><span className={`badge badge-${notif.type === 'announcement' ? 'info' : 'default'}`}>{notif.type}</span></td>
                                        <td>{notif.title}</td>
                                        <td>{notif.message?.substring(0, 60)}{notif.message?.length > 60 ? '...' : ''}</td>
                                        <td>{notif.readStatus ? '✓ Read' : '● Unread'}</td>
                                        <td>{new Date(notif.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;
