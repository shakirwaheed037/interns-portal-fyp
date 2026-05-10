import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import NotificationBell from '../NotificationBell/NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <div className="brand-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="icon-svg">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 13v-3l10-5v3l-10 5zm0 5v-3l10-5v3l-10 5z" />
                        </svg>
                    </div>
                    <span>Interns</span>
                </div>

                <div className="navbar-right-flex">
                    {userInfo && <NotificationBell userRole={userInfo.role} />}
                    <button className="navbar-hamburger" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className={`navbar-menu ${isOpen ? 'is-open' : ''}`}>
                    <div className="navbar-links">
                        <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
                        <NavLink to="/browse" onClick={() => setIsOpen(false)}>Find Internships</NavLink>
                        <NavLink to="/companies" onClick={() => setIsOpen(false)}>Companies</NavLink>
                        <NavLink to="/about" onClick={() => setIsOpen(false)}>About Us</NavLink>
                        <NavLink to="/contact" onClick={() => setIsOpen(false)}>Contact Us</NavLink>
                    </div>

                    <div className="navbar-actions">
                        {userInfo ? (
                            <>
                                <Link to={`/${userInfo.role}-dashboard`} className="btn-dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn-logout-nav">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-login" onClick={() => setIsOpen(false)}>Login</Link>
                                <Link to="/register" className="nav-signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
