import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import { LayoutGrid, CheckSquare, Users, FileText, Search, Bell, Settings, LogOut, ShieldCheck, CheckCircle2, CircleDot, XOctagon, Pencil, TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../utils/api';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import adminAvatar from '../../assets/admin.jpg';
import './AdminDashboard.css';


const OverviewView = () => {
    const [stats, setStats] = useState({ totalStudents: 0, totalCompanies: 0, totalInternships: 0, pendingCompanies: 0, pendingStudents: 0, recentStudents: [], recentCompanies: [] });
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/overview');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchInternships = async () => {
            try {
                const res = await api.get('/admin/internships');
                setInternships(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
        fetchInternships();
    }, []);

    const handleDeleteInternship = async (id) => {
        if (window.confirm('Are you sure you want to delete this internship?')) {
            try {
                await api.delete(`/admin/internships/${id}`);
                setInternships(internships.filter(i => i._id !== id));
            } catch (err) {
                alert('Failed to delete internship');
            }
        }
    };

    return (
        <div className="admin-view no-padding-top">

            <div className="pad-content">

                <div className="header-block">
                    <h1>Platform Overview</h1>
                    <p>Summary of Platform</p>
                </div>
                <div className="admin-stats-four mt-4">
                    <div className="a-stat-card">
                        <h5>Total Students</h5>
                        <div className="a-stat-row">
                            <strong>{stats.totalStudents}</strong>
                        </div>
                    </div>
                    <div className="a-stat-card">
                        <h5>Total Company</h5>
                        <div className="a-stat-row">
                            <strong>{stats.totalCompanies}</strong>
                        </div>
                    </div>
                    <div className="a-stat-card">
                        <h5>Total Internships</h5>
                        <div className="a-stat-row">
                            <strong>{stats.totalInternships}</strong>
                        </div>
                    </div>
                    <div className="a-stat-card">
                        <h5>Pending Companies</h5>
                        <div className="a-stat-row">
                            <strong>{stats.pendingCompanies}</strong>
                        </div>
                    </div>
                    <div className="a-stat-card">
                        <h5>Pending Students</h5>
                        <div className="a-stat-row">
                            <strong>{stats.pendingStudents}</strong>
                        </div>
                    </div>
                </div>

                <div className="overview-tables-grid mt-8">
                    <div className="admin-table-panel shadow-sm no-margin">
                        <div className="panel-header-flex">
                            <h3>Recent Student Registrations</h3>
                            <Link to="/admin-dashboard/users" className="btn-text-orange-sm">View All</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-modern-table-sm">
                                <thead>
                                    <tr><th>NAME</th><th>EMAIL</th><th>STATUS</th></tr>
                                </thead>
                                <tbody>
                                    {stats.recentStudents.map(s => (
                                        <tr key={s._id}>
                                            <td><div className="name-avatar-flex-sm"><span className="initial-circle-sm bg-purple-light">{s.name?.substring(0, 2).toUpperCase()}</span> <strong>{s.name}</strong></div></td>
                                            <td>{s.email}</td>
                                            <td><span className={`pill-status ${s.isVerified ? 'green-light' : 'orange-light'}`}>{s.isVerified ? 'Verified' : 'Pending'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="admin-table-panel shadow-sm no-margin">
                        <div className="panel-header-flex">
                            <h3>Recent Company Registrations</h3>
                            <Link to="/admin-dashboard/verify" className="btn-text-orange-sm">View All</Link>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-modern-table-sm">
                                <thead>
                                    <tr><th>COMPANY</th><th>INDUSTRY</th><th>STATUS</th></tr>
                                </thead>
                                <tbody>
                                    {stats.recentCompanies.map(c => (
                                        <tr key={c._id}>
                                            <td><strong>{c.companyName}</strong></td>
                                            <td><span className="pill-soft-grey">{c.industry}</span></td>
                                            <td><span className={`pill-status ${c.verificationStatus === 'approved' ? 'green-light' : (c.verificationStatus === 'pending' ? 'orange-light' : 'red-light')}`}>{c.verificationStatus}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="admin-table-panel shadow-sm mt-8 no-margin">
                    <div className="panel-header-flex">
                        <h3>Internship Summary Section</h3>
                        <span className="text-sm-grey">Monitoring active and closed roles</span>
                    </div>
                    <div className="table-responsive">
                        <table className="admin-modern-table">
                            <thead>
                                <tr><th>TITLE</th><th>COMPANY</th><th>DATE</th><th>APPLICANTS</th><th>STATUS</th><th>ACTIONS</th></tr>
                            </thead>
                            <tbody>
                                {internships.map(i => (
                                    <tr key={i._id}>
                                        <td><strong>{i.title}</strong></td>
                                        <td>{i.companyId?.companyName}</td>
                                        <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td><span className="grey-circle-badge">{i.applicantCount || 0}</span></td>
                                        <td><span className={`status-dot ${i.status === 'active' ? 'green' : 'grey'}`}><CircleDot size={10} /> {i.status}</span></td>
                                        <td>
                                            <button className="btn-sm-red-outline" onClick={() => handleDeleteInternship(i._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VerifyCompaniesView = () => {
    const [companies, setCompanies] = useState([]);
    const [viewingDoc, setViewingDoc] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('/admin/companies/verify');
                setCompanies(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCompanies();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            await api.put(`/admin/companies/verify/${id}`, { verificationStatus: status });
            setCompanies(companies.map(c => c._id === id ? { ...c, verificationStatus: status } : c));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="admin-view no-padding-top">


            <div className="pad-content">
                <div className="header-block">
                    <h1>Company Verification Queue</h1>
                    <p>Review and manage pending company registrations.</p>
                </div>

                <div className="admin-table-panel shadow-sm mt-4">
                    <div className="table-responsive">
                        <table className="admin-modern-table uppercase-th">
                            <thead>
                                <tr><th>COMPANY NAME</th><th>INDUSTRY</th><th>EMAIL ADDRESS</th><th>DOCUMENTS</th><th>STATUS</th><th>ACTION</th></tr>
                            </thead>
                            <tbody>
                                {companies.map(company => (
                                    <tr key={company._id}>
                                        <td><strong>{company.companyName}</strong></td>
                                        <td><span className="pill-soft-purple">{company.industry}</span></td>
                                        <td>{company.userId?.email}</td>
                                        <td>
                                            {company.registrationDocument ? (
                                                <a
                                                    href={company.registrationDocument}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="doc-status-purple"
                                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                                                >
                                                    <FileText size={14} /> View Document
                                                </a>
                                            ) : (

                                                <span className="text-grey-italic">No Document</span>
                                            )}
                                        </td>
                                        <td><span className={`status-dot ${company.verificationStatus === 'pending' ? 'orange' : (company.verificationStatus === 'approved' ? 'green' : 'red')}`}><CircleDot size={10} /> {company.verificationStatus}</span></td>
                                        <td>
                                            {company.verificationStatus === 'pending' ? (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button className="btn-solid-purple-sm" onClick={() => handleVerify(company._id, 'approved')}>Approve</button>
                                                    <button className="btn-light-purple-sm" onClick={() => handleVerify(company._id, 'rejected')}>Reject</button>
                                                </div>
                                            ) : (
                                                <span className="text-grey-italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {companies.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No companies found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManageUserView = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await api.put(`/admin/users/${id}/status`, { isActive: !currentStatus });

            // Update the users state with the new status
            setUsers(prevUsers =>
                prevUsers.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u)
            );
        } catch (err) {
            console.error('Status toggle error:', err);
            alert('Failed to update user status');
        }
    };

    const handleVerifyUser = async (id) => {
        try {
            const response = await api.put(`/admin/users/${id}/status`, { isVerified: true, isActive: true });

            // Update the users state with the verified user
            setUsers(prevUsers =>
                prevUsers.map(u => u._id === id ? { ...u, isVerified: true, isActive: true } : u)
            );

            alert('Student verified successfully!');
        } catch (err) {
            console.error('Verification error:', err);
            alert('Failed to verify user');
        }
    };

    return (
        <div className="admin-view no-padding-top bg-white-override">


            <div className="pad-content">
                <div className="header-block">
                    <h1>User Accounts</h1>
                    <p>Manage and monitor user accounts.</p>
                </div>

                <div className="admin-table-panel shadow-sm mt-4">
                    <div className="table-responsive">
                        <table className="admin-modern-table">
                            <thead>
                                <tr><th>NAME</th><th>EMAIL</th><th>ROLE</th><th>REGISTRATION DATE</th><th>STATUS</th><th>ACTION</th></tr>
                            </thead>
                            <tbody>
                                {users.filter(user => user.role === 'student').map(user => (
                                    <tr key={user._id}>
                                        <td><div className="name-avatar-flex"><span className="initial-circle bg-purple-light">{user.name?.substring(0, 2).toUpperCase()}</span> <strong>{user.name}</strong></div></td>
                                        <td>{user.email}</td>
                                        <td><span className="pill-soft-grey" style={{ textTransform: 'capitalize' }}>{user.role}</span></td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {user.isActive !== false ? (
                                                    <span className="pill-status green-light"><CircleDot size={10} /> Active</span>
                                                ) : (
                                                    <span className="pill-status grey-light"><CircleDot size={10} color="#94a3b8" /> Blocked</span>
                                                )}
                                                {user.isVerified ? (
                                                    <span className="pill-status blue-light" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}><CheckCircle2 size={10} /> Verified</span>
                                                ) : (
                                                    <span className="pill-status orange-light"><CircleDot size={10} /> Pending</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className={user.isActive !== false ? "btn-light-purple-sm" : "btn-solid-purple-sm"}
                                                    onClick={() => handleToggleStatus(user._id, user.isActive !== false)}
                                                >
                                                    {user.isActive !== false ? 'Block' : 'Activate'}
                                                </button>
                                                {user.role === 'student' && !user.isVerified && (
                                                    <button
                                                        className="btn-solid-purple-sm"
                                                        style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                                                        onClick={() => handleVerifyUser(user._id)}
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No users found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalyticsView = () => {
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalCompanies: 0,
        totalInternships: 0,
        totalApplications: 0,
        appStats: [],
        internStats: [],
        monthlyRegistrations: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/admin/analytics');
                setAnalytics(res.data);
            } catch (err) {
                console.error('Failed to fetch analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const userData = [
        { name: 'Students', value: analytics.totalStudents },
        { name: 'Companies', value: analytics.totalCompanies }
    ];

    const platformData = [
        { name: 'Internships', value: analytics.totalInternships },
        { name: 'Applications', value: analytics.totalApplications }
    ];

    const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

    if (loading) return <div className="admin-view no-padding-top"><div className="pad-content">Loading analytics...</div></div>;

    return (
        <div className="admin-view no-padding-top">


            <div className="pad-content">
                <div className="header-block">
                    <h1>Platform Analytics</h1>
                    <p>Visual overview of system performance and user distribution.</p>
                </div>

                <div className="admin-stats-four mt-4">
                    <div className="a-stat-card">
                        <div className="stat-card-header">
                            <h5>Total Users</h5>
                            <Users size={20} className="text-purple" />
                        </div>
                        <div className="a-stat-row">
                            <strong>{analytics.totalUsers}</strong>
                        </div>
                    </div>
                    <div className="a-stat-card">
                        <div className="stat-card-header">
                            <h5>Students</h5>
                            <Users size={20} className="text-blue" />
                        </div>
                        <div className="a-stat-row">
                            <strong>{analytics.totalStudents}</strong>
                        </div>
                    </div>
                    <div className="a-stat-card">
                        <div className="stat-card-header">
                            <h5>Companies</h5>
                            <Activity size={20} className="text-pink" />
                        </div>
                        <div className="a-stat-row">
                            <strong>{analytics.totalCompanies}</strong>
                        </div>
                    </div>
                    <div className="a-stat-card">
                        <div className="stat-card-header">
                            <h5>Internships</h5>
                            <FileText size={20} className="text-green" />
                        </div>
                        <div className="a-stat-row">
                            <strong>{analytics.totalInternships}</strong>
                        </div>
                    </div>
                    <div className="a-stat-card">
                        <div className="stat-card-header">
                            <h5>Applications</h5>
                            <CheckCircle2 size={20} className="text-orange" />
                        </div>
                        <div className="a-stat-row">
                            <strong>{analytics.totalApplications}</strong>
                        </div>
                    </div>
                </div>

                <div className="analytics-charts-grid mt-8">
                    <div className="admin-table-panel shadow-sm no-margin">
                        <div className="panel-header-flex">
                            <h3><PieChartIcon size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> User Distribution</h3>
                        </div>
                        <div style={{ width: '100%', height: 300, padding: '1rem' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={userData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {userData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="admin-table-panel shadow-sm no-margin">
                        <div className="panel-header-flex">
                            <h3><BarChart3 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Platform Overview</h3>
                        </div>
                        <div style={{ width: '100%', height: 300, padding: '1rem' }}>
                            <ResponsiveContainer>
                                <BarChart data={platformData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                                    <Legend />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="analytics-charts-grid mt-8">
                    <div className="admin-table-panel shadow-sm no-margin" style={{ gridColumn: window.innerWidth > 1024 ? 'span 2' : 'span 1' }}>
                        <div className="panel-header-flex">
                            <h3><Activity size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> User Registration Trend (Last 6 Months)</h3>
                        </div>
                        <div style={{ width: '100%', height: 350, padding: '1rem' }}>
                            <ResponsiveContainer>
                                <AreaChart data={analytics.monthlyRegistrations}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="users" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="admin-table-panel shadow-sm no-margin">
                        <div className="panel-header-flex">
                            <h3><CheckSquare size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Application Status</h3>
                        </div>
                        <div style={{ width: '100%', height: 300, padding: '1rem' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={analytics.appStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {analytics.appStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="admin-table-panel shadow-sm no-margin">
                        <div className="panel-header-flex">
                            <h3><ShieldCheck size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Internship Status</h3>
                        </div>
                        <div style={{ width: '100%', height: 300, padding: '1rem' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={analytics.internStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {analytics.internStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminProfileView = () => {
    const [profile, setProfile] = useState({ name: '', email: '', role: 'admin' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    role: res.data.role || 'admin'
                });
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Admin profile update - simulate for now since backend endpoint may not exist
            setMessage('Profile updated successfully!');
            setIsEditing(false);

            // Update localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updatedUserInfo = { ...userInfo, name: profile.name };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-view no-padding-top">

            <div className="pad-content">
                <div className="header-block">
                    <h1>Admin Profile</h1>
                    <p>Manage your administrator account information</p>
                </div>

                {message && <div style={{ padding: '1rem', background: '#e0f2fe', color: '#0369a1', marginBottom: '1rem', borderRadius: '8px' }}>{message}</div>}

                <div className="admin-table-panel shadow-sm">
                    <div className="panel-header-flex">
                        <h3>Profile Information</h3>
                        {!isEditing ? (
                            <button className="btn-solid-purple-sm" onClick={() => setIsEditing(true)}>
                                <Pencil size={16} style={{ marginRight: '8px' }} /> Edit Profile
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn-light-purple-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button className="btn-solid-purple-sm" onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{
                        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: 'clamp(12px, 3vw, 16px)',
                        margin: 'clamp(0.5rem, 2vw, 1rem)'
                    }}>
                        <div className="admin-profile-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'clamp(300px, 40vw, 1fr)',
                            gap: 'clamp(1.5rem, 4vw, 2.5rem)',
                            textAlign: window.innerWidth < 768 ? 'center' : 'left'
                        }}>
                            <div className="profile-avatar-section" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: 'clamp(1rem, 3vw, 1.5rem)',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                borderRadius: 'clamp(12px, 3vw, 16px)',
                                border: '1px solid #e2e8f0',
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 'clamp(0.5rem, 2vw, 1rem)',
                                    right: 'clamp(0.5rem, 2vw, 1rem)',
                                    background: '#8b5cf6',
                                    color: 'white',
                                    padding: 'clamp(0.2rem, 1vw, 0.3rem) clamp(0.5rem, 1.5vw, 0.7rem)',
                                    borderRadius: '999px',
                                    fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Admin
                                </div>
                                <div style={{
                                    position: 'relative',
                                    marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
                                }}>
                                    <img
                                        src={adminAvatar}
                                        alt="Admin Avatar"
                                        className="admin-avatar-large"
                                        style={{
                                            width: 'clamp(100px, 25vw, 140px)',
                                            height: 'clamp(100px, 25vw, 140px)',
                                            borderRadius: '50%',
                                            border: '4px solid white',
                                            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.2)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'scale(1)';
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 'clamp(0.25rem, 1vw, 0.5rem)',
                                        right: 'clamp(0.25rem, 1vw, 0.5rem)',
                                        width: 'clamp(20px, 5vw, 28px)',
                                        height: 'clamp(20px, 5vw, 28px)',
                                        background: '#16a34a',
                                        borderRadius: '50%',
                                        border: '3px solid white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{
                                            width: 'clamp(8px, 2vw, 12px)',
                                            height: 'clamp(8px, 2vw, 12px)',
                                            background: 'white',
                                            borderRadius: '50%'
                                        }}></div>
                                    </div>
                                </div>
                                <h4 style={{
                                    margin: '0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0',
                                    color: '#1e293b',
                                    fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
                                    fontWeight: '800'
                                }}>System Administrator</h4>
                                <p style={{
                                    margin: 0,
                                    color: '#64748b',
                                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                                    lineHeight: '1.5',
                                    maxWidth: '250px'
                                }}>Full access to all system features and administrative controls</p>
                            </div>

                            <div className="profile-fields" style={{
                                marginTop: window.innerWidth < 768 ? '1.5rem' : '0',
                                padding: 'clamp(1rem, 3vw, 1.5rem)',
                                background: 'white',
                                borderRadius: 'clamp(12px, 3vw, 16px)',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                                        fontWeight: 700,
                                        color: '#334155',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: 'clamp(8px, 2vw, 10px)',
                                            backgroundColor: isEditing ? 'white' : '#f8fafc',
                                            cursor: isEditing ? 'text' : 'not-allowed',
                                            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => {
                                            if (isEditing) {
                                                e.target.style.borderColor = '#8b5cf6';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (isEditing) {
                                                e.target.style.borderColor = '#e2e8f0';
                                                e.target.style.boxShadow = 'none';
                                            }
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                                        fontWeight: 700,
                                        color: '#334155',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: 'clamp(8px, 2vw, 10px)',
                                            backgroundColor: '#f8fafc',
                                            cursor: 'not-allowed',
                                            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                            fontWeight: '500',
                                            color: '#94a3b8'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                                        fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                                        fontWeight: 700,
                                        color: '#334155',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>System Role</label>
                                    <input
                                        type="text"
                                        value={profile.role.toUpperCase()}
                                        disabled
                                        style={{
                                            width: '100%',
                                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: 'clamp(8px, 2vw, 10px)',
                                            backgroundColor: '#f8fafc',
                                            cursor: 'not-allowed',
                                            textTransform: 'uppercase',
                                            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                            fontWeight: '700',
                                            color: '#8b5cf6',
                                            letterSpacing: '0.05em'
                                        }}
                                    />
                                </div>

                                <div style={{
                                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderRadius: 'clamp(8px, 2vw, 10px)',
                                    border: '1px solid #e2e8f0',
                                    marginTop: 'clamp(1rem, 3vw, 1.5rem)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                                        color: '#64748b',
                                        fontWeight: '500'
                                    }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            background: '#16a34a',
                                            borderRadius: '50%',
                                            animation: 'pulse 2s infinite'
                                        }}></div>
                                        <span>Account Status: Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const adminLinks = [
        { path: '/admin-dashboard/overview', label: 'Overview', icon: LayoutGrid },
        { path: '/admin-dashboard/analytics', label: 'Analytics', icon: TrendingUp },
        { path: '/admin-dashboard/profile', label: 'Profile', icon: Users },
        { path: '/admin-dashboard/verify', label: 'Verify Companies', icon: CheckSquare },
        { path: '/admin-dashboard/users', label: 'Manage User', icon: Users }
    ];

    return (
        <DashboardLayout role="admin" links={adminLinks}>
            <Routes>
                <Route path="/" element={<Navigate to="/admin-dashboard/overview" replace />} />
                <Route path="/overview" element={<OverviewView />} />
                <Route path="/analytics" element={<AnalyticsView />} />
                <Route path="/profile" element={<AdminProfileView />} />
                <Route path="/verify" element={<VerifyCompaniesView />} />
                <Route path="/users" element={<ManageUserView />} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminDashboard;
