import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LayoutGrid, User, FileText, Award, Upload, Search, ChevronDown, CheckCircle2, Eye } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './StudentDashboard.css';

import studentImg from '../../assets/student.jpg';

const ProfileView = () => {
    const [profile, setProfile] = useState({ name: '', email: '', university: '', department: '', enrollmentNumber: '', semester: '', skills: '', resume: null });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [viewingResume, setViewingResume] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    university: res.data.profile?.university || '',
                    program: res.data.profile?.program || '',
                    enrollmentNumber: res.data.profile?.enrollmentNumber || '',
                    semester: res.data.profile?.semester || '',
                    skills: res.data.profile?.skills?.join(', ') || '',
                    profilePic: res.data.profilePic || '',
                    resume: null,
                    resumeUrl: res.data.profile?.resume || ''
                });
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        
        try {
            // Enhanced validation with detailed error messages
            const validationErrors = [];
            
            if (!profile.name || profile.name.trim() === '') {
                validationErrors.push('Name is required');
            } else if (profile.name.trim().length < 2) {
                validationErrors.push('Name must be at least 2 characters');
            }
            
            if (!profile.university || profile.university.trim() === '') {
                validationErrors.push('University is required');
            }
            
            if (!profile.program || profile.program.trim() === '') {
                validationErrors.push('Program is required');
            }
            
            if (!profile.semester || profile.semester.trim() === '') {
                validationErrors.push('Semester is required');
            }
            
            if (!profile.enrollmentNumber || profile.enrollmentNumber.trim() === '') {
                validationErrors.push('Enrollment number is required');
            } else if (profile.enrollmentNumber.trim().length < 3) {
                validationErrors.push('Enrollment number must be at least 3 characters');
            }
            
            if (validationErrors.length > 0) {
                setMessage(validationErrors.join(', '));
                return;
            }

            // Handle file uploads with better error handling
            let resumeUrl = profile.resume || '';
            if (profile.newResume) {
                try {
                    const resumeData = new FormData();
                    resumeData.append('document', profile.newResume);
                    const resumeRes = await api.post('/upload', resumeData);
                    resumeUrl = resumeRes.data.url;
                    
                    if (!resumeUrl) {
                        throw new Error('Failed to upload resume');
                    }
                } catch (uploadErr) {
                    console.error('Resume upload error:', uploadErr);
                    setMessage('Failed to upload resume. Please try again.');
                    return;
                }
            }

            const skillsArray = profile.skills 
                ? profile.skills.split(',').map(s => s.trim()).filter(s => s)
                : [];
            
            let profilePicUrl = profile.profilePic || '';
            if (profile.newProfilePic) {
                try {
                    const picData = new FormData();
                    picData.append('document', profile.newProfilePic);
                    const picRes = await api.post('/upload', picData);
                    profilePicUrl = picRes.data.url;
                    
                    if (!profilePicUrl) {
                        throw new Error('Failed to upload profile picture');
                    }
                } catch (uploadErr) {
                    console.error('Profile picture upload error:', uploadErr);
                    setMessage('Failed to upload profile picture. Please try again.');
                    return;
                }
            }

            // Prepare the update data with proper structure
            const updateData = {
                name: profile.name.trim(),
                skills: skillsArray, 
                university: profile.university.trim(),
                program: profile.program.trim(),
                semester: profile.semester.trim(),
                enrollmentNumber: profile.enrollmentNumber.trim(),
                resume: resumeUrl,
                profilePic: profilePicUrl
            };

            // Remove empty fields to avoid sending unnecessary data
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === '' || updateData[key] === null || updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            console.log('Sending profile update:', updateData);
            
            // Make the API call with proper timeout and error handling
            const res = await api.put('/students/profile', updateData);
            console.log('Profile update response:', res.data);

            // Validate response
            if (!res.data || !res.data.name) {
                throw new Error('Invalid response from server');
            }

            // Update localStorage with the response data
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updatedUserInfo = { 
                ...userInfo, 
                name: res.data.name, 
                profilePic: res.data.profilePic || userInfo.profilePic 
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            // Show success message
            setMessage('Profile updated successfully!');
            toast.success('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
            
            // Update the local profile state to reflect changes immediately
            setProfile(prev => ({
                ...prev,
                name: res.data.name,
                profilePic: res.data.profilePic || prev.profilePic,
                newProfilePic: null,
                newResume: null
            }));
            
            // Exit edit mode
            // Exit edit mode if you want, or just stay
            // setIsEditing(false);
            
        } catch (err) {
            console.error('Profile update error:', err);
            
            // Enhanced error handling with specific messages
            if (err.response) {
                // Server responded with error status
                const status = err.response.status;
                const errorMessage = err.response.data?.message || 'Server error occurred';
                
                if (status === 400) {
                    setMessage(`Validation error: ${errorMessage}`);
                } else if (status === 401) {
                    setMessage('Authentication error. Please log in again.');
                } else if (status === 403) {
                    setMessage('Permission denied. You cannot update this profile.');
                } else if (status === 404) {
                    setMessage('Profile not found. Please contact support.');
                } else if (status >= 500) {
                    setMessage('Server error. Please try again later.');
                } else {
                    setMessage(`Error updating profile: ${errorMessage}`);
                }
            } else if (err.request) {
                // Network error
                setMessage('Network error. Please check your connection and try again.');
            } else if (err.code === 'ECONNABORTED') {
                setMessage('Request timeout. Please try again.');
            } else {
                // Other error
                setMessage(`Error updating profile: ${err.message || 'Unknown error occurred'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dash-view">
            <div className="dash-header">
                <h1>Profile</h1>
                <p>Manage your personal information and resume</p>
            </div>
            {message && <div style={{ padding: '1rem', background: '#e0f2fe', color: '#0369a1', marginBottom: '1rem', borderRadius: '8px' }}>{message}</div>}
            <div className="profile-card">
                <h3>Profile Picture</h3>
                <div className="avatar-upload-flex">
                    <img src={profile.profilePic || studentImg} alt="Profile" className="profile-avatar-large" />
                    <div className="upload-actions">
                        <label className="btn-light-purple-sm" style={{ cursor: 'pointer' }}>
                            Change Photo
                            <input type="file" style={{ display: 'none' }} onChange={(e) => setProfile({ ...profile, newProfilePic: e.target.files[0], profilePic: URL.createObjectURL(e.target.files[0]) })} />
                        </label>
                        <p className="text-grey-xs mt-2">JPG or PNG. Max 2MB</p>
                    </div>
                </div>

                <h3 className="mt-8">Personal Information</h3>
                <div className="profile-grid">
                    <div className="input-box-light"><label>Full Name</label><input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
                    <div className="input-box-light"><label>Email Address</label><input type="email" value={profile.email} disabled /></div>
                    <div className="input-box-light"><label>University</label><input type="text" value={profile.university} onChange={e => setProfile({ ...profile, university: e.target.value })} /></div>
                    <div className="input-box-light">
                        <label>Program</label>
                        <select value={profile.program} onChange={e => setProfile({ ...profile, program: e.target.value })}>
                            <option value="">Select Program</option>
                            <option>Software Engineering</option>
                            <option>Artificial Intelligence</option>
                            <option>Data Science</option>
                            <option>Cyber Security</option>
                            <option>Information Technology</option>
                        </select>
                    </div>
                    <div className="input-box-light"><label>Enrollment Number</label><input type="text" value={profile.enrollmentNumber} onChange={e => setProfile({ ...profile, enrollmentNumber: e.target.value })} /></div>
                    <div className="input-box-light">
                        <label>Semester</label>
                        <select value={profile.semester} onChange={e => setProfile({ ...profile, semester: e.target.value })}>
                            <option value="">Select Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="input-box-light full-w"><label>Skills (comma separated)</label><input type="text" value={profile.skills} onChange={e => setProfile({ ...profile, skills: e.target.value })} /></div>
                </div>
            </div>

            <div className="resume-section">
                <h3>Resume</h3>
                <div className="resume-upload-box">
                    <div className="upload-icon-circle"><Upload className="text-orange" size={24} /></div>
                    <h4>Upload your latest resume</h4>
                    <p>PDF, DOCX up to 5MB</p>
                    <label className="btn-text-orange" style={{ cursor: 'pointer', display: 'inline-block' }}>
                        {profile.resume ? profile.resume.name : 'Choose file'}
                        <input type="file" style={{ display: 'none' }} onChange={(e) => setProfile({ ...profile, resume: e.target.files[0] })} />
                    </label>
                </div>

                <div className="save-row mt-4">
                    <button className="btn-purple-save" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                    {profile.resumeUrl && (
                        <a 
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-light-purple-sm ml-4" 
                            style={{ padding: '0.8rem 1.5rem', marginLeft: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                        >
                            <Eye size={18} style={{ marginRight: '8px' }} /> View Current Resume
                        </a>
                    )}

                </div>
            </div>
        </div>
    );
};

const BrowseInternshipsView = () => {
    const [internships, setInternships] = useState([]);
    const [loadingMap, setLoadingMap] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [applySuccess, setApplySuccess] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', location: '', qualification: '', resume: null });

    // Check if internship is still open for applications
    const isInternshipOpen = (internship) => {
        if (!internship.lastDateToApply) return true;
        const today = new Date();
        const lastDate = new Date(internship.lastDateToApply);
        return today <= lastDate;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No Deadline';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };



    const openApplyModal = (internship) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        setSelectedInternship(internship);
        setFormData({ name: userInfo.name || '', email: userInfo.email || '', location: '', qualification: '', resume: null });
        setShowModal(true);
        setApplySuccess(false);
    };

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        const id = selectedInternship._id;
        setLoadingMap({ ...loadingMap, [id]: true });
        try {
            let resumeUrl = '';
            
            // Upload resume if provided
            if (formData.resume) {
                const resumeData = new FormData();
                resumeData.append('document', formData.resume);
                const resumeRes = await api.post('/upload', resumeData);
                resumeUrl = resumeRes.data.url;
            }

            // Prepare application data
            const applicationData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                location: formData.location.trim(),
                qualification: formData.qualification.trim(),
                resume: resumeUrl
            };

            console.log('Sending application data:', applicationData);

            await api.post(`/students/apply/${id}`, applicationData);
            setApplySuccess(true);
            toast.success(`Application for ${selectedInternship.title} sent successfully!`);
            setTimeout(() => {
                setShowModal(false);
                setSelectedInternship(null);
            }, 2000);
        } catch (err) {
            console.error('Application submission error:', err.response?.data);
            const errorMessage = err.response?.data?.message || 'Failed to apply';
            alert(errorMessage);
        } finally {
            setLoadingMap({ ...loadingMap, [id]: false });
        }
    };


    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const res = await api.get('/internships');
                setInternships(res.data);
            } catch (err) {
                console.error('Error fetching internships', err);
            }
        };

        fetchInternships();
    }, []);



    return (
        <div className="dash-view">
            <div className="dash-header">
                <h1>Browse Internships</h1>
                <p>Discover and apply to verified internships</p>
            </div>

            <div className="internship-cards-grid mt-8">
                {internships.map(internship => (
                    <div className="dash-intern-card" key={internship._id}>
                        <div className="card-top-bg">
                            <div className="card-logo-box"><div className="logo-placeholder bg-dark-green">{internship.companyId?.companyName?.substring(0, 2).toUpperCase() || 'CP'}</div></div>
                        </div>
                        <div className="card-body">
                            <div className="card-meta-row">
                                <span className="badge-new">NEW</span>
                                <span className={`deadline-badge ${isInternshipOpen(internship) ? 'open' : 'closed'}`}>
                                    {isInternshipOpen(internship) ? 'Open' : 'Closed'}
                                </span>
                                <div className="salary-box">
                                    <strong>{internship.stipend || 'Unpaid'}</strong>
                                    <span>{internship.duration || 'N/A'}</span>
                                </div>
                            </div>
                            <h2>{internship.title}</h2>
                            <div className="comp-loc-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <p className="comp-loc" style={{ margin: 0 }}>{internship.companyId?.companyName || 'Company'}</p>
                                {internship.companyId?.verified && (
                                    <span className="verified-badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '1px 6px', borderRadius: '10px', fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                        <CheckCircle2 size={10} /> Verified
                                    </span>
                                )}
                                {internship.companyId?.type && (
                                    <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '1px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 600 }}>
                                        {internship.companyId.type}
                                    </span>
                                )}
                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>•</span>
                                <p className="comp-loc" style={{ margin: 0 }}>{internship.location || 'Remote'}</p>
                                {internship.lastDateToApply && (
                                    <p className="deadline-date" style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                                        Last Date: {formatDate(internship.lastDateToApply)}
                                    </p>
                                )}
                            </div>
                            <p className="desc-text-sm" style={{ maxHeight: '60px', overflow: 'hidden' }}>{internship.description}</p>
                            <div className="skills-row-sm">
                                {internship.skills?.slice(0, 3).map((skill, idx) => <span key={idx}>{skill}</span>)}
                            </div>
                            <button 
                                className={`btn-apply-purple ${!isInternshipOpen(internship) ? 'disabled' : ''}`} 
                                onClick={() => openApplyModal(internship)} 
                                disabled={loadingMap[internship._id] || !isInternshipOpen(internship)}
                            >
                                {loadingMap[internship._id] ? 'Applying...' : (isInternshipOpen(internship) ? 'Apply Now' : 'Application Closed')}
                            </button>
                        </div>
                    </div>
                ))}
                {internships.length === 0 && <p>No internships available right now.</p>}
            </div>

            {showModal && selectedInternship && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <button className="modal-close-x" onClick={() => setShowModal(false)}>
                            <ChevronDown size={20} />
                        </button>

                        {applySuccess ? (
                            <div className="success-message">
                                <div className="success-icon-circle">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h2>Application Sent!</h2>
                                <p>You have successfully applied to {selectedInternship.title} at {selectedInternship.companyId?.companyName}.</p>
                            </div>
                        ) : (
                            <form className="apply-form" onSubmit={handleApplySubmit}>
                                <div className="modal-header-section">
                                    <h2 className="modal-title">Apply for Internship</h2>
                                    <p className="modal-subtitle">Applying to {selectedInternship.title} at {selectedInternship.companyId?.companyName}</p>
                                </div>

                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.name} 
                                        onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={formData.email} 
                                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Current Location</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="City, Country" 
                                        value={formData.location} 
                                        onChange={e => setFormData({ ...formData, location: e.target.value })} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Highest Qualification</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g. B.Tech Computer Science" 
                                        value={formData.qualification} 
                                        onChange={e => setFormData({ ...formData, qualification: e.target.value })} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Upload Resume (PDF/DOC/DOCX)</label>
                                    <div className="file-input-wrapper">
                                        <input 
                                            type="file" 
                                            accept=".pdf,.doc,.docx" 
                                            onChange={e => setFormData({ ...formData, resume: e.target.files[0] })} 
                                        />
                                        <div className="file-info">
                                            <Upload className="text-purple" size={24} />
                                            {formData.resume ? (
                                                <strong>{formData.resume.name}</strong>
                                            ) : (
                                                <span>Click to upload or drag and drop</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn-submit-apply"
                                    disabled={loadingMap[selectedInternship._id]}
                                >
                                    {loadingMap[selectedInternship._id] ? 'Sending...' : 'Submit Application'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const MyApplicationsView = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            const res = await api.get('/students/applications');
            setApplications(res.data);
        };
        fetchApplications();
    }, []);

    return (
        <div className="dash-view">
            <div className="dash-header">
                <h1>My Applications</h1>
                <p>Track the status of your internship applications</p>
            </div>

            <div className="application-list mt-8">
                {applications.map(app => (
                    <div className="app-card" key={app._id}>
                        <div className="app-img" style={{ background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={32} color="#94a3b8" />
                        </div>
                        <div className="app-info">
                            <div className="app-top-row">
                                <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                                <h3>{app.internshipId?.title || 'Unknown Internship'}</h3>
                            </div>
                            <p className="app-comp">{app.companyId?.companyName || 'Company'}</p>
                            <p className="app-date">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {applications.length === 0 && <p>You haven't applied to any internships yet.</p>}
            </div>
        </div>
    );
};

const CertificateView = () => (
    <div className="dash-view">
        <div className="dash-header">
            <h1>Certificate</h1>
            <p>View and download your Internship</p>
        </div>

        <div className="certificate-empty-card">
            <div className="cert-empty-content">
                <div className="big-badge-icon">
                    <Award size={48} color="white" />
                </div>
                <h2>No Certificate Yet</h2>
                <p>Complete your first internship to see your certificates here.</p>
            </div>
        </div>
    </div>
);

const StudentDashboard = () => {
    const studentLinks = [
        { path: '/student-dashboard/profile', label: 'Profile', icon: User },
        { path: '/student-dashboard/browse', label: 'Browse Internship', icon: Search },
        { path: '/student-dashboard/applications', label: 'My Application', icon: FileText },
        { path: '/student-dashboard/certificate', label: 'Certificate', icon: Award },
    ];

    return (
        <DashboardLayout role="student" links={studentLinks}>
            <Routes>
                <Route path="/" element={<Navigate to="/student-dashboard/profile" replace />} />
                <Route path="/profile" element={<ProfileView />} />
                <Route path="/browse" element={<BrowseInternshipsView />} />
                <Route path="/applications" element={<MyApplicationsView />} />
                <Route path="/certificate" element={<CertificateView />} />
            </Routes>
        </DashboardLayout>
    );
};

export default StudentDashboard;
