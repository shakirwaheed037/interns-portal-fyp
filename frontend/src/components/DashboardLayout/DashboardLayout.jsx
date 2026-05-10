import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Settings, Menu, X, ChevronLeft, ChevronRight, Search, User, Building2 } from 'lucide-react';
import SettingsModal from '../SettingsModal/SettingsModal';
import NotificationBell from '../NotificationBell/NotificationBell';
import './DashboardLayout.css';

import studentImg from '../../assets/student.jpg';
import companyImg from '../../assets/company.jpg';

const DashboardLayout = ({ role, links, children }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userName = userInfo.name || 'User';

    // Capitalize role for display
    const displayRole = userInfo.role ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1) : 'User';

    // Render appropriate avatar based on user role
    const renderAvatar = (size = 24, className = '') => {
        if (userInfo.profilePic) {
            return <img src={userInfo.profilePic} alt="Avatar" className={className} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
        }
        
        if (userInfo.role === 'company') {
            return <img src={companyImg} alt="Avatar" className={className} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
        } else if (userInfo.role === 'student') {
            return <img src={studentImg} alt="Avatar" className={className} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
        } else {
            return <User size={size} className={className} />;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    return (
        <div className={`dashboard-light-container ${role}-mode ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Mobile Header */}
            <header className="mobile-dashboard-header">
                <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
                <span className="mobile-logo-text">Dashboard</span>
                <div className="mobile-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <NotificationBell userRole={userInfo.role} />
                    <div className="mobile-avatar-box">
                        {renderAvatar(24, 'mobile-avatar')}
                    </div>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

            <aside className={`dashboard-light-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                <button
                    className="collapse-toggle-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                <div className="sidebar-mobile-close">
                    <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                </div>
                <div className="sidebar-profile-header">
                    <div className="sidebar-avatar">
                        {renderAvatar(32, 'sidebar-avatar-icon')}
                    </div>
                    <div className="sidebar-user-info">
                        <h3>{userName}</h3>
                        <p>{displayRole}</p>
                    </div>
                </div>

                <nav className="sidebar-light-nav">
                    {links.map((link, idx) => (
                        <NavLink
                            key={idx}
                            to={link.path}
                            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                            end={link.path === `/${role}-dashboard`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <link.icon className="nav-icon" size={20} />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-light-bottom">
                    <button className="nav-item" onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="nav-icon" size={20} />
                        <span>Settings</span>
                    </button>
                    <button className="nav-item logout-btn" onClick={handleLogout}>
                        <LogOut className="nav-icon logout-icon" size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className="dashboard-light-main">
                <header className="dashboard-desktop-header">
                    <div className="header-search-container">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search for anything..." />
                    </div>
                    <div className="header-right-actions">
                        <NotificationBell userRole={userInfo.role} />
                        <div className="header-divider"></div>
                        <div className="user-profile-summary">
                            <div className="user-avatar">
                                {renderAvatar(20, 'header-avatar-icon')}
                            </div>
                            <div className="user-text-meta">
                                <span className="u-name">{userName}</span>
                                <span className="u-role">{displayRole}</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="dashboard-content-area">
                    {children}
                </div>
            </main>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                role={role}
            />
        </div>
    );
};

export default DashboardLayout;
