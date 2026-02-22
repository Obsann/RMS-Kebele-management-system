import React, { useState } from 'react';
import { toast } from 'sonner';
import { authAPI } from '../services/api';

const ForgotPassword = ({ onBack }) => {
    const [step, setStep] = useState('request'); // 'request' or 'reset'
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Reset token generated. Check your email or use the token below (dev mode).');
            // In development, the token is returned in the response
            if (data.resetToken) {
                setToken(data.resetToken);
            }
            setStep('reset');
        } catch (err) {
            toast.error(err.message || 'Failed to request reset');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Password reset successfully! You can now login.');
            onBack();
        } catch (err) {
            toast.error(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>{step === 'request' ? 'Forgot Password' : 'Reset Password'}</h2>

            {step === 'request' ? (
                <form onSubmit={handleRequestReset}>
                    <p className="text-muted" style={{ marginBottom: '1rem' }}>
                        Enter your email address and we'll send you a reset token.
                    </p>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com" required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Token'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                        <label>Reset Token</label>
                        <input type="text" value={token} onChange={e => setToken(e.target.value)}
                            placeholder="Paste your reset token" required style={{ fontFamily: 'monospace' }} />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                            placeholder="Min 6 characters" required minLength={6} />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password" required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}

            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button type="button" onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                    ← Back to Login
                </button>
            </p>
        </div>
    );
};

export default ForgotPassword;
