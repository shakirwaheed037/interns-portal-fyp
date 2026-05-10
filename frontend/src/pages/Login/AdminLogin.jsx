import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Login.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Role is fixed to admin for this page
            const { data } = await api.post('/auth/login', { email, password, role: 'admin' });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Admin login successful!', { duration: 2000 });
            navigate('/admin-dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Admin login failed';
            setError(errorMessage);
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#fff',
                    color: '#8b5cf6',
                    border: '1px solid #ddd6fe',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
            });
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card-modern admin-theme">
                <div className="login-logo-circle" style={{ backgroundColor: '#f3e8ff' }}>
                    <ShieldCheck size={24} color="#8b5cf6" />
                </div>
                <h2 style={{ color: '#8b5cf6' }}>Admin Portal</h2>
                <p className="login-subtitle">Secure administrative access only</p>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={submitHandler} className="login-form-modern">
                    <div className="form-group-modern">
                        <label>Admin Email</label>
                        <input 
                            type="email" 
                            placeholder="admin@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            style={{ borderColor: '#d8b4fe' }}
                        />
                    </div>

                    <div className="form-group-modern">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                style={{ borderColor: '#d8b4fe' }}
                            />
                            <button 
                                type="button" 
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-signin-blue" 
                        style={{ backgroundColor: '#8b5cf6' }}
                    >
                        Access Dashboard
                    </button>
                </form>

                <div className="forgot-password-link">
                    <Link to="/login" style={{ color: '#8b5cf6', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>← Back to User Login</Link>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>
                        First time admin? <Link to="/register?role=admin" style={{ color: '#8b5cf6', fontWeight: '700' }}>Register here</Link>
                    </p>
                </div>

                <div className="login-footer-modern">
                    System Administration Panel v1.0
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
