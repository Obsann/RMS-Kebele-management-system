import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { auditAPI } from '../../services/api';

const AdminAuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ action: '', targetType: '', page: 1 });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    useEffect(() => {
        loadData();
    }, [filters.page]);

    const loadData = async () => {
        try {
            setLoading(true);
            const params = { page: filters.page, limit: 30 };
            if (filters.action) params.action = filters.action;
            if (filters.targetType) params.targetType = filters.targetType;

            const [logsData, statsData] = await Promise.all([
                auditAPI.getLogs(params),
                auditAPI.getStats()
            ]);
            setLogs(logsData.logs || []);
            setPagination(logsData.pagination || { page: 1, pages: 1, total: 0 });
            setStats(statsData);
        } catch (err) {
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 });
        loadData();
    };

    const actionColors = {
        CREATE: 'var(--success)',
        UPDATE: 'var(--info)',
        DELETE: 'var(--danger)',
    };

    return (
        <div className="page-container">
            <h1>Audit Log</h1>

            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.total}</div>
                        <div className="text-muted">Total Events</div>
                    </div>
                    {(stats.byAction || []).slice(0, 4).map(a => (
                        <div key={a._id} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: actionColors[a._id?.split('_')[0]] || 'var(--text)' }}>{a.count}</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{a._id}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <form onSubmit={handleFilter} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Action Type</label>
                        <input type="text" placeholder="e.g. CREATE_USERS" value={filters.action}
                            onChange={e => setFilters({ ...filters, action: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Target Type</label>
                        <select value={filters.targetType} onChange={e => setFilters({ ...filters, targetType: e.target.value })}>
                            <option value="">All</option>
                            <option value="users">Users</option>
                            <option value="requests">Requests</option>
                            <option value="jobs">Jobs</option>
                            <option value="households">Households</option>
                            <option value="notifications">Notifications</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Filter</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setFilters({ action: '', targetType: '', page: 1 }); loadData(); }}>Clear</button>
                </form>
            </div>

            <div className="card">
                {loading ? (
                    <p className="text-muted">Loading...</p>
                ) : logs.length === 0 ? (
                    <p className="text-muted">No audit logs found</p>
                ) : (
                    <>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Actor</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                        <th>Details</th>
                                        <th>IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log._id}>
                                            <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td>{log.actorId?.username || 'System'}</td>
                                            <td><span className="badge">{log.actorRole}</span></td>
                                            <td>
                                                <span style={{ color: actionColors[log.action?.split('_')[0]] || 'var(--text)', fontWeight: 600, fontSize: '0.85rem' }}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.8rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.details}</td>
                                            <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{log.ipAddress || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {pagination.pages > 1 && (
                            <div className="pagination" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                                <button className="btn btn-sm btn-secondary" disabled={pagination.page <= 1}
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>← Prev</button>
                                <span style={{ padding: '0.5rem', fontSize: '0.85rem' }}>
                                    Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                                </span>
                                <button className="btn btn-sm btn-secondary" disabled={pagination.page >= pagination.pages}
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next →</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminAuditLog;
