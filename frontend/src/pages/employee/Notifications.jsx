import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { notificationsAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';

const EmployeeNotifications = () => {
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

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1>Notifications</h1>
                    <p className="text-gray-600 mt-1">View your notifications and announcements</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        {loading ? (
                            <p className="text-gray-600">Loading...</p>
                        ) : history.length === 0 ? (
                            <p className="text-gray-600">No notifications yet</p>
                        ) : (
                            <div className="space-y-4">
                                {history.map(notif => (
                                    <div key={notif._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${notif.type === 'announcement' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                                                {notif.type}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                                        <p className="text-gray-700 mt-1">{notif.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployeeNotifications;
