import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { householdsAPI, usersAPI } from '../../services/api';

const AdminHouseholds = () => {
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [residents, setResidents] = useState([]);
    const [formData, setFormData] = useState({
        houseNo: '', headOfHousehold: '', type: 'residential',
        address: { kebele: '', woreda: '', subcity: '' }
    });
    const [selectedHousehold, setSelectedHousehold] = useState(null);
    const [newMember, setNewMember] = useState({ user: '', relationship: '' });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    useEffect(() => {
        loadHouseholds();
        loadResidents();
    }, []);

    const loadHouseholds = async (page = 1) => {
        try {
            setLoading(true);
            const data = await householdsAPI.getAll({ page, limit: 20 });
            setHouseholds(data.households || []);
            if (data.pagination) setPagination(data.pagination);
        } catch (err) {
            toast.error('Failed to load households');
        } finally {
            setLoading(false);
        }
    };

    const loadResidents = async () => {
        try {
            const data = await usersAPI.getByRole('resident');
            setResidents(data.users || []);
        } catch (err) {
            console.error('Failed to load residents');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await householdsAPI.create(formData);
            toast.success('Household created');
            setShowForm(false);
            setFormData({ houseNo: '', headOfHousehold: '', type: 'residential', address: { kebele: '', woreda: '', subcity: '' } });
            loadHouseholds();
        } catch (err) {
            toast.error(err.message || 'Failed to create household');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this household?')) return;
        try {
            await householdsAPI.delete(id);
            toast.success('Household deleted');
            loadHouseholds();
        } catch (err) {
            toast.error('Failed to delete household');
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!selectedHousehold || !newMember.user) return;
        try {
            await householdsAPI.addMember(selectedHousehold._id, newMember);
            toast.success('Member added');
            setNewMember({ user: '', relationship: '' });
            loadHouseholds();
            // Refresh selected household
            const updated = await householdsAPI.getById(selectedHousehold._id);
            setSelectedHousehold(updated);
        } catch (err) {
            toast.error(err.message || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!selectedHousehold) return;
        try {
            await householdsAPI.removeMember(selectedHousehold._id, memberId);
            toast.success('Member removed');
            const updated = await householdsAPI.getById(selectedHousehold._id);
            setSelectedHousehold(updated);
            loadHouseholds();
        } catch (err) {
            toast.error('Failed to remove member');
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Household Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ New Household'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2>Create Household</h2>
                    <form onSubmit={handleCreate}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>House Number</label>
                                <input type="text" value={formData.houseNo} required
                                    onChange={e => setFormData({ ...formData, houseNo: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="mixed">Mixed</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Head of Household</label>
                            <select value={formData.headOfHousehold} required
                                onChange={e => setFormData({ ...formData, headOfHousehold: e.target.value })}>
                                <option value="">Select resident...</option>
                                {residents.map(r => (
                                    <option key={r._id} value={r._id}>{r.username} ({r.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Kebele</label>
                                <input type="text" value={formData.address.kebele}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, kebele: e.target.value } })} />
                            </div>
                            <div className="form-group">
                                <label>Woreda</label>
                                <input type="text" value={formData.address.woreda}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, woreda: e.target.value } })} />
                            </div>
                            <div className="form-group">
                                <label>Sub-city</label>
                                <input type="text" value={formData.address.subcity}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, subcity: e.target.value } })} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Create Household</button>
                    </form>
                </div>
            )}

            {selectedHousehold && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="page-header">
                        <h2>Members — House #{selectedHousehold.houseNo}</h2>
                        <button className="btn btn-secondary" onClick={() => setSelectedHousehold(null)}>Close</button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {(selectedHousehold.members || []).map(m => (
                            <li key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                                <span>{m.user?.username || m.user} — <em>{m.relationship}</em></span>
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveMember(m._id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <select value={newMember.user} onChange={e => setNewMember({ ...newMember, user: e.target.value })} required>
                            <option value="">Select resident...</option>
                            {residents.map(r => <option key={r._id} value={r._id}>{r.username}</option>)}
                        </select>
                        <input type="text" placeholder="Relationship" value={newMember.relationship}
                            onChange={e => setNewMember({ ...newMember, relationship: e.target.value })} required />
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>
                </div>
            )}

            <div className="card">
                {loading ? (
                    <p className="text-muted">Loading...</p>
                ) : households.length === 0 ? (
                    <p className="text-muted">No households registered</p>
                ) : (
                    <>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>House No</th>
                                        <th>Type</th>
                                        <th>Head</th>
                                        <th>Members</th>
                                        <th>Kebele</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {households.map(h => (
                                        <tr key={h._id}>
                                            <td><strong>{h.houseNo}</strong></td>
                                            <td><span className="badge">{h.type}</span></td>
                                            <td>{h.headOfHousehold?.username || '—'}</td>
                                            <td>{h.members?.length || 0}</td>
                                            <td>{h.address?.kebele || '—'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedHousehold(h)}>Members</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(h._id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {pagination.pages > 1 && (
                            <div className="pagination">
                                {Array.from({ length: pagination.pages }, (_, i) => (
                                    <button key={i + 1} className={`btn btn-sm ${pagination.page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => loadHouseholds(i + 1)}>{i + 1}</button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminHouseholds;
