import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password, role });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login successful! Redirecting...', { duration: 2000 });
            navigate(`/${data.role}-dashboard`);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#fff',
                    color: '#ef4444',
                    border: '1px solid #fee2e2',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
            });
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card-modern">
                <div className="login-logo-circle">
                    <div className="logo-cutout"></div>
                </div>
                <h2>Sign In</h2>
                <p className="login-subtitle">Enter your credentials to access your account</p>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={submitHandler} className="login-form-modern">
                    <div className="form-group-modern">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group-modern">
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
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

                    <div className="form-group-modern">
                        <label>Role</label>
                        <div className="role-select-wrapper">
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="student">Student</option>
                                <option value="company">Company</option>

                            </select>
                            <ChevronDown className="select-icon" size={16} />
                        </div>
                    </div>

                    <button type="submit" className="btn-signin-blue">Sign In</button>
                </form>

                <p className="admin-login-link-container">
                    <span>Admin? </span>
                    <Link to="/admin-login" className="admin-link">Login here</Link>
                </p>

                <div className="forgot-password-link">
                    <Link to="#">Forgot password?</Link>
                </div>

                <div className="login-footer-modern">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
