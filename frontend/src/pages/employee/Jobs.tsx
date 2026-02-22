import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { jobsAPI } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const EmployeeJobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [completionNotes, setCompletionNotes] = useState('');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    useEffect(() => {
        loadJobs();
    }, [statusFilter]);

    const loadJobs = async (page = 1) => {
        try {
            setLoading(true);
            const params = { page, limit: 20 };
            if (statusFilter) params.status = statusFilter;
            const data = await jobsAPI.getAll(params);
            setJobs(data.jobs || []);
            if (data.pagination) setPagination(data.pagination);
        } catch (err) {
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (jobId, status) => {
        try {
            const updateData = { status };
            if (status === 'completed') {
                updateData.completionNotes = completionNotes;
                updateData.completedAt = new Date();
            }
            await jobsAPI.update(jobId, updateData);
            toast.success(`Job marked as ${status}`);
            setSelectedJob(null);
            setCompletionNotes('');
            loadJobs();
        } catch (err) {
            toast.error('Failed to update job');
        }
    };

    const statusColors = {
        pending: 'var(--warning)',
        assigned: 'var(--info)',
        'in-progress': 'var(--primary)',
        completed: 'var(--success)',
        cancelled: 'var(--danger)',
    };

    const priorityColors = { low: '#6b7280', medium: '#f59e0b', high: '#ef4444', urgent: '#dc2626' };

    return (
        <div className="page-container">
            <h1>My Jobs</h1>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['', 'assigned', 'in-progress', 'completed'].map(s => (
                    <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setStatusFilter(s)}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            {selectedJob && (
                <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div className="page-header">
                        <h2>{selectedJob.title}</h2>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedJob(null)}>✕</button>
                    </div>
                    <p>{selectedJob.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                        <span><strong>Category:</strong> {selectedJob.category}</span>
                        <span><strong>Priority:</strong> <span style={{ color: priorityColors[selectedJob.priority] }}>{selectedJob.priority}</span></span>
                        <span><strong>Unit:</strong> {selectedJob.unit || '—'}</span>
                        {selectedJob.dueDate && <span><strong>Due:</strong> {new Date(selectedJob.dueDate).toLocaleDateString()}</span>}
                    </div>
                    {selectedJob.status !== 'completed' && selectedJob.status !== 'cancelled' && (
                        <div>
                            <div className="form-group">
                                <label>Completion Notes</label>
                                <textarea value={completionNotes} onChange={e => setCompletionNotes(e.target.value)}
                                    placeholder="Describe work done..." rows={3} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {selectedJob.status === 'assigned' && (
                                    <button className="btn btn-primary" onClick={() => handleStatusUpdate(selectedJob._id, 'in-progress')}>
                                        Start Work
                                    </button>
                                )}
                                <button className="btn btn-primary" style={{ background: 'var(--success)' }}
                                    onClick={() => handleStatusUpdate(selectedJob._id, 'completed')}>
                                    Mark Complete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="card">
                {loading ? (
                    <p className="text-muted">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <p className="text-muted">No jobs found</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Unit</th>
                                    <th>Due Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job._id}>
                                        <td><strong>{job.title}</strong></td>
                                        <td>{job.category}</td>
                                        <td><span style={{ color: priorityColors[job.priority], fontWeight: 600 }}>{job.priority}</span></td>
                                        <td><span className="badge" style={{ background: statusColors[job.status], color: '#fff' }}>{job.status}</span></td>
                                        <td>{job.unit || '—'}</td>
                                        <td>{job.dueDate ? new Date(job.dueDate).toLocaleDateString() : '—'}</td>
                                        <td>
                                            <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedJob(job); setCompletionNotes(''); }}>
                                                View
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

export default EmployeeJobs;
