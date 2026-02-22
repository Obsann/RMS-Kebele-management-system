import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { reportsAPI } from '../../services/api';

const AdminReports = () => {
    const [overview, setOverview] = useState(null);
    const [demographics, setDemographics] = useState(null);
    const [requestReport, setRequestReport] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const [overviewData, demoData, reqData] = await Promise.all([
                reportsAPI.getOverview(),
                reportsAPI.getDemographics(),
                reportsAPI.getRequestReport()
            ]);
            setOverview(overviewData);
            setDemographics(demoData);
            setRequestReport(reqData);
        } catch (err) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ label, value, color = 'var(--primary)' }) => (
        <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center', minWidth: '150px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
        </div>
    );

    const BarChart = ({ data, label }) => {
        if (!data || data.length === 0) return <p className="text-muted">No data</p>;
        const max = Math.max(...data.map(d => d.count));
        return (
            <div>
                <h3 style={{ marginBottom: '1rem' }}>{label}</h3>
                {data.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ minWidth: '120px', fontSize: '0.85rem', textAlign: 'right' }}>{item._id || 'Unknown'}</span>
                        <div style={{ flex: 1, background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', height: '24px' }}>
                            <div style={{ width: `${(item.count / max) * 100}%`, background: 'var(--primary)', height: '100%', borderRadius: '4px', transition: 'width 0.5s ease', minWidth: '30px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>
                                {item.count}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return <div className="page-container"><p className="text-muted">Loading reports...</p></div>;

    return (
        <div className="page-container">
            <h1>Reports & Analytics</h1>

            <div className="tab-nav" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {['overview', 'demographics', 'requests'].map(tab => (
                    <button key={tab} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab(tab)}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && overview && (
                <div>
                    <h2>System Overview</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <StatCard label="Total Users" value={overview.users?.total || 0} />
                        <StatCard label="Pending Approvals" value={overview.users?.pending || 0} color="var(--warning)" />
                        <StatCard label="Residents" value={overview.users?.residents || 0} color="var(--info)" />
                        <StatCard label="Employees" value={overview.users?.employees || 0} color="var(--success)" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <StatCard label="Total Requests" value={overview.requests?.total || 0} />
                        <StatCard label="Pending Requests" value={overview.requests?.pending || 0} color="var(--warning)" />
                        <StatCard label="Completed Requests" value={overview.requests?.completed || 0} color="var(--success)" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <StatCard label="Total Jobs" value={overview.jobs?.total || 0} />
                        <StatCard label="Pending Jobs" value={overview.jobs?.pending || 0} color="var(--warning)" />
                        <StatCard label="Digital IDs" value={overview.digitalIds?.total || 0} color="var(--info)" />
                        <StatCard label="Households" value={overview.households?.total || 0} />
                    </div>
                </div>
            )}

            {activeTab === 'demographics' && demographics && (
                <div>
                    <h2>Demographics</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        <div className="card"><BarChart data={demographics.byRole} label="Users by Role" /></div>
                        <div className="card"><BarChart data={demographics.byStatus} label="Users by Status" /></div>
                        <div className="card"><BarChart data={demographics.byUnit} label="Top Units (by population)" /></div>
                        <div className="card"><BarChart data={demographics.registrationTrend?.map(d => ({ _id: `${d._id?.year}-${String(d._id?.month).padStart(2, '0')}`, count: d.count }))} label="Registration Trend (12 months)" /></div>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && requestReport && (
                <div>
                    <h2>Request Analytics</h2>
                    {requestReport.avgResolutionTime && (
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3>Resolution Time</h3>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div><strong>Average:</strong> {Math.round((requestReport.avgResolutionTime.avgTime || 0) / 3600000)}h</div>
                                <div><strong>Fastest:</strong> {Math.round((requestReport.avgResolutionTime.minTime || 0) / 3600000)}h</div>
                                <div><strong>Slowest:</strong> {Math.round((requestReport.avgResolutionTime.maxTime || 0) / 3600000)}h</div>
                            </div>
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        <div className="card"><BarChart data={requestReport.byType} label="By Type" /></div>
                        <div className="card"><BarChart data={requestReport.byStatus} label="By Status" /></div>
                        <div className="card"><BarChart data={requestReport.byPriority} label="By Priority" /></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
