import React, { useState } from 'react';
import { toast } from 'sonner';
import { digitalIdAPI } from '../../services/api';

const EmployeeIdVerification = () => {
    const [qrCode, setQrCode] = useState('');
    const [result, setResult] = useState(null);
    const [verifying, setVerifying] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!qrCode.trim()) {
            toast.error('Please enter a QR code');
            return;
        }
        try {
            setVerifying(true);
            setResult(null);
            const data = await digitalIdAPI.verify(qrCode.trim());
            setResult(data);
            if (data.valid) {
                toast.success('ID is valid!');
            } else {
                toast.error('ID is invalid or expired');
            }
        } catch (err) {
            setResult({ valid: false, message: err.message || 'Verification failed' });
            toast.error(err.message || 'Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="page-container">
            <h1>Digital ID Verification</h1>

            <div className="card" style={{ maxWidth: '600px' }}>
                <h2>Scan or Enter QR Code</h2>
                <form onSubmit={handleVerify}>
                    <div className="form-group">
                        <label>QR Code / ID Code</label>
                        <input type="text" value={qrCode} onChange={e => setQrCode(e.target.value)}
                            placeholder="e.g. QR-UNIT-ABC123-TIMESTAMP" style={{ fontFamily: 'monospace', fontSize: '1.1rem' }} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={verifying}>
                        {verifying ? 'Verifying...' : 'Verify ID'}
                    </button>
                </form>
            </div>

            {result && (
                <div className="card" style={{ maxWidth: '600px', marginTop: '1.5rem', borderLeft: `4px solid ${result.valid ? 'var(--success)' : 'var(--danger)'}` }}>
                    <h2 style={{ color: result.valid ? 'var(--success)' : 'var(--danger)' }}>
                        {result.valid ? '✓ Valid ID' : '✕ Invalid ID'}
                    </h2>

                    {result.valid && result.digitalId && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                            <div><strong>Name:</strong> {result.digitalId.user?.username || '—'}</div>
                            <div><strong>Email:</strong> {result.digitalId.user?.email || '—'}</div>
                            <div><strong>Unit:</strong> {result.digitalId.user?.unit || '—'}</div>
                            <div><strong>Status:</strong> <span className="badge" style={{ background: 'var(--success)', color: '#fff' }}>{result.digitalId.status}</span></div>
                            <div><strong>Issued:</strong> {result.digitalId.issuedAt ? new Date(result.digitalId.issuedAt).toLocaleDateString() : '—'}</div>
                            <div><strong>Expires:</strong> {result.digitalId.expiresAt ? new Date(result.digitalId.expiresAt).toLocaleDateString() : '—'}</div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <strong>QR Code:</strong> <code>{result.digitalId.qrCode}</code>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <strong>Verifications:</strong> {result.digitalId.verifications?.length || 0} times
                            </div>
                        </div>
                    )}

                    {!result.valid && result.message && (
                        <p style={{ marginTop: '0.5rem' }}>{result.message}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmployeeIdVerification;
