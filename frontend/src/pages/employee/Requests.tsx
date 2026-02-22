import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { requestsAPI } from '../../services/api';

const EmployeeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    useEffect(() => {
        loadRequests();
    }, [statusFilter]);

    const loadRequests = async (page = 1) => {
        try {
            setLoading(true);
            const params = { page, limit: 20 };
            if (statusFilter) params.status = statusFilter;
            const data = await requestsAPI.getAll(params);
            setRequests(data.requests || []);
            if (data.pagination) setPagination(data.pagination);
        } catch (err) {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await requestsAPI.updateStatus(id, status, responseText);
            toast.success(`Request marked as ${status}`);
            setSelectedRequest(null);
            setResponseText('');
            loadRequests();
        } catch (err) {
            toast.error('Failed to update request');
        }
    };

    const priorityColors = { low: '#6b7280', medium: '#f59e0b', high: '#ef4444', urgent: '#dc2626' };
    const statusColors = { pending: 'var(--warning)', 'in-progress': 'var(--info)', completed: 'var(--success)', cancelled: 'var(--danger)' };

    const typeLabels = {
        maintenance: 'Maintenance', complaint: 'Complaint', certificate: 'Certificate',
        id_renewal: 'ID Renewal', address_confirmation: 'Address Confirmation',
        property_transfer: 'Property Transfer', business_license: 'Business License',
        general_inquiry: 'General Inquiry'
    };

    return (
        <div className="page-container">
            <h1>Service Requests</h1>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['', 'pending', 'in-progress', 'completed', 'cancelled'].map(s => (
                    <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setStatusFilter(s)}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {selectedRequest && (
                <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div className="page-header">
                        <h2>{selectedRequest.subject}</h2>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedRequest(null)}>✕</button>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                        <span><strong>Type:</strong> {typeLabels[selectedRequest.type] || selectedRequest.type}</span>
                        <span><strong>Category:</strong> {selectedRequest.category}</span>
                        <span><strong>Priority:</strong> <span style={{ color: priorityColors[selectedRequest.priority] }}>{selectedRequest.priority}</span></span>
                        <span><strong>Unit:</strong> {selectedRequest.unit}</span>
                        <span><strong>Resident:</strong> {selectedRequest.resident?.username || '—'}</span>
                    </div>
                    <p style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        {selectedRequest.description}
                    </p>

                    {selectedRequest.status !== 'completed' && selectedRequest.status !== 'cancelled' && (
                        <div>
                            <div className="form-group">
                                <label>Response Message</label>
                                <textarea value={responseText} onChange={e => setResponseText(e.target.value)}
                                    placeholder="Write a response to the resident..." rows={3} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {selectedRequest.status === 'pending' && (
                                    <button className="btn btn-primary" onClick={() => handleUpdateStatus(selectedRequest._id, 'in-progress')}>
                                        Start Processing
                                    </button>
                                )}
                                <button className="btn btn-primary" style={{ background: 'var(--success)' }}
                                    onClick={() => handleUpdateStatus(selectedRequest._id, 'completed')}>
                                    Complete
                                </button>
                                <button className="btn btn-secondary" style={{ color: 'var(--danger)' }}
                                    onClick={() => handleUpdateStatus(selectedRequest._id, 'cancelled')}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedRequest.response?.message && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
                            <strong>Previous Response:</strong> {selectedRequest.response.message}
                        </div>
                    )}
                </div>
            )}

            <div className="card">
                {loading ? (
                    <p className="text-muted">Loading...</p>
                ) : requests.length === 0 ? (
                    <p className="text-muted">No requests found</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Type</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Resident</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req._id}>
                                        <td><strong>{req.subject}</strong></td>
                                        <td>{typeLabels[req.type] || req.type}</td>
                                        <td><span style={{ color: priorityColors[req.priority], fontWeight: 600 }}>{req.priority}</span></td>
                                        <td><span className="badge" style={{ background: statusColors[req.status], color: '#fff' }}>{req.status}</span></td>
                                        <td>{req.resident?.username || '—'}</td>
                                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedRequest(req); setResponseText(''); }}>
                                                Handle
                                            </button>
                                        </td>
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

export default EmployeeRequests;
