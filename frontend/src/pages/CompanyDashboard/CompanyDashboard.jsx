import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Users, ClipboardList, MapPin, Search, Filter, Pencil, MoreVertical, Plus, Eye, CheckCircle2, Send, Code, Calendar, FileText, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../utils/api';
import './CompanyDashboard.css';

import companyImg from '../../assets/company.jpg';

const CompanyProfileView = () => {
    const [profile, setProfile] = useState({ companyName: '', industry: '', type: '', email: '', location: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setProfile({
                    companyName: res.data.profile?.companyName || '',
                    industry: res.data.profile?.industry || '',
                    type: res.data.profile?.type || '',
                    email: res.data.email || '',
                    location: res.data.profile?.location || '',
                    description: res.data.profile?.description || '',
                    logo: res.data.profile?.logo || '',
                    isApproved: res.data.profile?.isApproved || false
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
            let logoUrl = profile.logo;
            if (profile.newLogo) {
                const logoData = new FormData();
                logoData.append('document', profile.newLogo);
                const logoRes = await api.post('/upload', logoData);
                logoUrl = logoRes.data.url;
            }

            const res = await api.put('/companies/profile', { ...profile, logo: logoUrl });

            // Update localStorage
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updatedUserInfo = { ...userInfo, name: res.data.companyName, profilePic: res.data.logo };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setMessage('Profile updated successfully!');
            setTimeout(() => {
                setMessage('');
                window.location.reload();
            }, 1000);
        } catch (err) {
            setMessage('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dash-view">
            <div className="dash-header">
                <h1>Company Profile</h1>
                <p>Manage your company information and settings</p>
            </div>
            {message && <div style={{ padding: '1rem', background: '#e0f2fe', color: '#0369a1', marginBottom: '1rem', borderRadius: '8px' }}>{message}</div>}
            <div className="profile-card">
                <h3>Company Logo</h3>
                <div className="avatar-upload-flex">
                    <img src={profile.logo || companyImg} alt="Logo" className="profile-avatar-large" />
                    <div className="upload-actions">
                        <label className="btn-light-purple-sm" style={{ cursor: 'pointer' }}>
                            Upload Logo
                            <input type="file" style={{ display: 'none' }} onChange={(e) => setProfile({ ...profile, newLogo: e.target.files[0], logo: URL.createObjectURL(e.target.files[0]) })} />
                        </label>
                        <p className="text-grey-xs mt-2">JPG or PNG. Max 2MB</p>
                    </div>
                </div>

                <h3 className="mt-8">Company Information</h3>
                <div className="profile-grid">
                    <div className="input-box-light"><label>Company Name</label><input type="text" value={profile.companyName} onChange={e => setProfile({ ...profile, companyName: e.target.value })} /></div>
                    <div className="input-box-light">
                        <label>Industry</label>
                        <select value={profile.industry} onChange={e => setProfile({ ...profile, industry: e.target.value })}>
                            <option>Technology</option>
                            <option>Education</option>
                            <option>Finance</option>
                            <option>Healthcare</option>
                            <option>Media</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="input-box-light">
                        <label>Company Type</label>
                        <select value={profile.type} onChange={e => setProfile({ ...profile, type: e.target.value })}>
                            <option>Software House</option>
                            <option>University</option>
                            <option>Corporate</option>
                        </select>
                    </div>
                    <div className="input-box-light"><label>Contact Email</label><input type="email" value={profile.email} disabled /></div>
                    <div className="input-box-light"><label>Location</label><input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} /></div>
                    <div className="input-box-light full-w"><label>Company Description</label><textarea value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} style={{ minHeight: '120px' }}></textarea></div>
                </div>
                <div className="save-row">
                    <button className="btn-purple-save" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>

            <div className="profile-card mt-6" style={{ borderLeft: '4px solid #8b5cf6', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>Account Status</h3>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                            {profile.isApproved ? 'Your company is verified and approved to post internships.' : 'Your company profile is under review by admin.'}
                        </p>
                    </div>
                    <span className={`status-pill-solid ${profile.isApproved ? 'approved' : 'pending'}`} style={{ 
                        padding: '6px 16px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem', 
                        fontWeight: 700,
                        background: profile.isApproved ? '#dcfce7' : '#ffedd5',
                        color: profile.isApproved ? '#16a34a' : '#ea580c'
                    }}>
                        {profile.isApproved ? 'Approved' : 'Pending Verification'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const PostInternshipView = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', skillsRequired: '', description: '', duration: '', stipend: '', location: '', lastDateToApply: '' });
    const [loading, setLoading] = useState(false);
    const [isApproved, setIsApproved] = useState(true);

    useEffect(() => {
        const checkApproval = async () => {
            try {
                const res = await api.get('/auth/profile');
                setIsApproved(res.data.profile?.isApproved || false);
            } catch (err) {
                console.error('Failed to check approval status', err);
            }
        };
        checkApproval();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const skillsArray = formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s);
            await api.post('/companies/internships', { ...formData, skillsRequired: skillsArray });
            navigate('/company-dashboard/internships');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to post internship');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dash-view">
            <div className="dash-header">
                <h1>Post New Internship</h1>
                <p>Create a new internship opportunity for students</p>
            </div>
            <div className="profile-card">
                <div className="flex-align mb-4 gap-2 border-b pb-3">
                    <div className="icon-badge-purple"><Briefcase size={16} /></div>
                    <h3 style={{ margin: 0 }}>Internship Details</h3>
                </div>
                <div className="profile-grid">
                    <div className="input-box-light"><label>Internship Title</label><input type="text" placeholder="e.g Frontend Developer Intern" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                    <div className="input-box-light"><label>Required Skills (comma separated)</label><input type="text" placeholder="e.g React, JavaScript, CSS" value={formData.skillsRequired} onChange={e => setFormData({ ...formData, skillsRequired: e.target.value })} /></div>
                    <div className="input-box-light full-w"><label>Description</label><textarea placeholder="Describe the internship role" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ minHeight: '150px' }}></textarea></div>
                    <div className="input-box-light"><label>Duration</label><input type="text" placeholder="e.g 3 Months" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} /></div>
                    <div className="input-box-light"><label>Stipend</label><input type="text" placeholder="e.g PKR 50,000/month or unpaid" value={formData.stipend} onChange={e => setFormData({ ...formData, stipend: e.target.value })} /></div>
                    <div className="input-box-light"><label>Last Date to Apply</label><input type="date" name="lastDateToApply" value={formData.lastDateToApply} onChange={e => setFormData({ ...formData, lastDateToApply: e.target.value })} /></div>
                    <div className="input-box-light full-w"><label>Location / Remote</label><input type="text" placeholder="e.g Remote, Pakistan" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                </div>
                {!isApproved && (
                    <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldCheck size={20} />
                        <span><strong>Notice:</strong> Your company is not approved by admin yet. You will be able to post once approved.</span>
                    </div>
                )}
                <div className="save-row form-actions-row">
                    <button className="btn-white-cancel" onClick={() => navigate(-1)}>Cancel</button>
                    <button className="btn-purple-save flex-align-gap" onClick={handleSubmit} disabled={loading || !isApproved}><Send size={16} /> {loading ? 'Posting...' : 'Post Internship'}</button>
                </div>
            </div>
        </div>
    );
};

const ApplicantsView = () => {
    const [internships, setInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState('');
    const [applicants, setApplicants] = useState([]);
    const [viewingResume, setViewingResume] = useState(null);

    useEffect(() => {
        const fetchInternships = async () => {
            const res = await api.get('/companies/internships');
            setInternships(res.data);
            if (res.data.length > 0) setSelectedInternship(res.data[0]._id);
        };
        fetchInternships();
    }, []);

    useEffect(() => {
        if (selectedInternship) {
            const fetchApplicants = async () => {
                const res = await api.get(`/companies/applicants/${selectedInternship}`);
                setApplicants(res.data);
            };
            fetchApplicants();
        }
    }, [selectedInternship]);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/companies/applications/${id}`, { status });
            setApplicants(applicants.map(app => app._id === id ? { ...app, status } : app));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="dash-view">
            <div className="dash-header">
                <h1>Applicants Management</h1>
                <p>Review and decide on applications for your roles.</p>
            </div>

            <div className="applicants-filter-pane">
                <div className="filter-item-group">
                    <label>Filter by Internship Role</label>
                    <div className="select-with-icon">
                        <Briefcase size={16} className="sel-icon" />
                        <select value={selectedInternship} onChange={e => setSelectedInternship(e.target.value)}>
                            {internships.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
                        </select>
                    </div>
                </div>
                <div className="applicant-count-pill">
                    <strong>{applicants.length}</strong> Total Applicants
                </div>
            </div>

            <div className="applicants-grid-container mt-8">
                {applicants.map(app => (
                    <div key={app._id} className="applicant-modern-card">
                        <div className="app-card-top">
                            <div className="app-user-info">
                                <div className="app-avatar-box">
                                    {app.name?.substring(0, 2).toUpperCase() || 'ST'}
                                </div>
                                <div className="app-name-meta">
                                    <h3>{app.name || app.studentId?.userId?.name}</h3>
                                    <span>{app.email || app.studentId?.userId?.email}</span>
                                </div>
                            </div>
                            <span className={`status-pill-solid ${app.status.toLowerCase()}`}>
                                {app.status}
                            </span>
                        </div>

                        <div className="app-card-details">
                            <div className="detail-row">
                                <MapPin size={14} /> <span>{app.location || 'Remote'}</span>
                            </div>
                            <div className="detail-row">
                                <Code size={14} /> <span>{app.qualification || 'Bachelors'}</span>
                            </div>
                            <div className="detail-row">
                                <Calendar size={14} /> <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                            {(app.resume || app.studentId?.resume) && (
                                <a
                                    href={app.resume || app.studentId.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-view-resume-sm"
                                    style={{
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        backgroundColor: '#eff6ff',
                                        color: '#3b82f6',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        marginTop: '12px',
                                        border: '1px solid #dbeafe'
                                    }}
                                >
                                    <FileText size={16} /> View Resume
                                </a>
                            )}

                        </div>

                        <div className="app-card-actions">
                            {app.status === 'pending' ? (
                                <>
                                    <button className="btn-approve-grad" onClick={() => handleUpdateStatus(app._id, 'accepted')}>
                                        Approve Candidate
                                    </button>
                                    <button className="btn-reject-outline" onClick={() => handleUpdateStatus(app._id, 'rejected')}>
                                        Reject
                                    </button>
                                </>
                            ) : (
                                <div className="status-locked-msg">
                                    Decision made on {new Date(app.updatedAt).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {applicants.length === 0 && (
                    <div className="no-applicants-empty">
                        <Users size={48} />
                        <p>No applications found for this internship yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PastInternshipsView = () => {
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        const fetchInternships = async () => {
            const res = await api.get('/companies/internships');
            setInternships(res.data);
        };
        fetchInternships();
    }, []);

    return (
        <div className="dash-view">
            <div className="dash-header flex-between mb-0">
                <div>
                    <h1>Posted Internships</h1>
                    <p>Manage and review your internship opportunities.</p>
                </div>
                <Link to="/company-dashboard/post" className="btn-orange-post flex-align-gap">
                    <Plus size={18} /> Post New Role
                </Link>
            </div>

            <div className="past-roles-list mt-8">
                {internships.map(internship => (
                    <div className="past-role-card" key={internship._id}>
                        <div className="role-img-box" style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={40} color="#cbd5e1" />
                            <span className={`role-image-badge text-white ${internship.isActive ? 'bg-green' : 'bg-grey-dark'}`}>
                                {internship.isActive ? 'ACTIVE' : 'CLOSED'}
                            </span>
                        </div>
                        <div className="role-info-card-box">
                            <div className="role-info-header">
                                <h2>{internship.title}</h2>
                            </div>
                            <div className="role-meta-row">
                                <span><MapPin size={14} /> {internship.location || 'Remote'}</span>
                                <span><Calendar size={14} /> Posted {new Date(internship.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="role-btn-row">
                                <Link to={`/company-dashboard/applicants`} className="btn-block-orange" style={{ textAlign: 'center', display: 'inline-block' }}>View Applicants</Link>
                            </div>
                        </div>
                    </div>
                ))}
                {internships.length === 0 && <p>No internships posted yet.</p>}
            </div>
        </div>
    );
};

const PastRecordView = () => {
    const [internships, setInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState('');
    const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0, pending: 0 });
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchInternships = async () => {
            const res = await api.get('/companies/internships');
            setInternships(res.data);
            if (res.data.length > 0) setSelectedInternship(res.data[0]._id);
        };
        fetchInternships();
    }, []);

    useEffect(() => {
        if (selectedInternship) {
            const fetchDetails = async () => {
                const res = await api.get(`/companies/applicants/${selectedInternship}`);
                setApplications(res.data);

                const s = { total: res.data.length, accepted: 0, rejected: 0, pending: 0 };
                res.data.forEach(a => {
                    if (a.status === 'accepted') s.accepted++;
                    else if (a.status === 'rejected') s.rejected++;
                    else s.pending++;
                });
                setStats(s);
            };
            fetchDetails();
        }
    }, [selectedInternship]);

    return (
        <div className="dash-view">
            <div className="dash-header">
                <h1>Historical Records</h1>
                <p>Track performance and application history for your past roles.</p>
            </div>

            <div className="record-filter-card">
                <div className="filter-header-flex">
                    <div className="filter-label-group">
                        <ClipboardList size={20} className="text-purple" />
                        <span>Select Internship to View Records</span>
                    </div>
                    <select
                        className="modern-select-purple"
                        value={selectedInternship}
                        onChange={e => setSelectedInternship(e.target.value)}
                    >
                        {internships.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
                    </select>
                </div>

                <div className="record-stats-grid mt-6">
                    <div className="r-stat-item">
                        <div className="r-stat-val">{stats.total}</div>
                        <div className="r-stat-lab">Total Applications</div>
                    </div>
                    <div className="r-stat-item border-l">
                        <div className="r-stat-val text-green">{stats.accepted}</div>
                        <div className="r-stat-lab">Accepted</div>
                    </div>
                    <div className="r-stat-item border-l">
                        <div className="r-stat-val text-red">{stats.rejected}</div>
                        <div className="r-stat-lab">Rejected</div>
                    </div>
                    <div className="r-stat-item border-l">
                        <div className="r-stat-val text-orange">{stats.pending}</div>
                        <div className="r-stat-lab">Under Review</div>
                    </div>
                </div>
            </div>

            <div className="record-list-panel mt-8">
                <div className="panel-inner-header">
                    <h3>Detailed Application Log</h3>
                </div>
                <div className="table-wrapper">
                    <table className="modern-table">
                        <thead>
                            <tr><th>APPLICANT</th><th>QUALIFICATION</th><th>STATUS</th><th>DECISION DATE</th></tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td>
                                        <div className="user-record-flex">
                                            <div className="user-rec-avatar">{app.name?.substring(0, 2).toUpperCase()}</div>
                                            <div>
                                                <div className="user-rec-name">{app.name}</div>
                                                <div className="user-rec-email">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{app.qualification || 'N/A'}</td>
                                    <td><span className={`pill-status-sm ${app.status}`}>{app.status}</span></td>
                                    <td>{new Date(app.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {applications.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>No records found for this internship.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const CompanyDashboard = () => {
    const companyLinks = [
        { path: '/company-dashboard/profile', label: 'Profile', icon: User },
        { path: '/company-dashboard/internships', label: 'Posted Internships', icon: Briefcase },
        { path: '/company-dashboard/applicants', label: 'Applicants', icon: Users },
        { path: '/company-dashboard/record', label: 'Past Record', icon: ClipboardList },
    ];

    return (
        <DashboardLayout role="company" links={companyLinks}>
            <Routes>
                <Route path="/" element={<Navigate to="/company-dashboard/profile" replace />} />
                <Route path="/profile" element={<CompanyProfileView />} />
                <Route path="/post" element={<PostInternshipView />} />
                <Route path="/applicants" element={<ApplicantsView />} />
                <Route path="/internships" element={<PastInternshipsView />} />
                <Route path="/record" element={<PastRecordView />} />
            </Routes>
        </DashboardLayout>
    );
};

export default CompanyDashboard;
