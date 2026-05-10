import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, ChevronDown, ChevronLeft, ChevronRight, Package, TrendingUp, Code, Box, X, Building, Eye, Mail, Globe, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Browse.css';

const Browse = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal state
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', location: '', qualification: '' });
    const [applying, setApplying] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);
    const [applyError, setApplyError] = useState('');

    // Company profile modal state
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyModal, setShowCompanyModal] = useState(false);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const res = await api.get('/internships');
                // Sort latest first
                const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setInternships(sorted);
            } catch (err) {
                console.error('Error fetching internships:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    const filteredInternships = internships.filter((i) => {
        const s = searchTerm.toLowerCase();
        return (
            (i.title && i.title.toLowerCase().includes(s)) ||
            (i.companyId?.companyName && i.companyId.companyName.toLowerCase().includes(s)) ||
            (i.skills && i.skills.some(skill => skill.toLowerCase().includes(s)))
        );
    });

    const openApplyModal = (internship) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!userInfo.token || userInfo.role !== 'student') {
            alert('Please login as a student to apply for internships.');
            navigate('/login');
            return;
        }

        setSelectedInternship(internship);
        setFormData({ name: userInfo.name || '', email: userInfo.email || '', location: '', qualification: '' });
        setShowModal(true);
        setApplySuccess(false);
        setApplyError('');
    };

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        setApplying(true);
        setApplyError('');
        try {
            await api.post(`/students/apply/${selectedInternship._id}`, formData);
            setApplySuccess(true);
            setTimeout(() => {
                setShowModal(false);
                setSelectedInternship(null);
            }, 3000);
        } catch (err) {
            setApplyError(err.response?.data?.message || 'Failed to apply. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    const openCompanyProfile = (companyId) => {
        setSelectedCompany(companyId);
        setShowCompanyModal(true);
    };

    return (
        <div className="browse-page-wrapper">
            <div className="browse-header-section">
                <h1>Browse Internships</h1>
                <p>Find your dream internship today in your preferred location and profile.</p>

                <div className="search-bar-container">
                    <div className="search-input-wrapper">
                        <Search className="search-bar-icon" />
                        <input
                            type="text"
                            placeholder="Search by title, company, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>


            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading internships...</div>
            ) : (
                <div className="internships-list">
                    {filteredInternships.map((internship) => (
                        <div key={internship._id} className="internship-list-card">
                            <div className="card-top-row">
                                <div className="card-titles">
                                    <h2>{internship.title}</h2>
                                    <p className="company-name">{internship.companyId?.companyName || 'Unknown Company'}</p>
                                </div>
                                <div className="card-icon-box" style={{ background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box size={24} color="#64748b" />
                                </div>
                            </div>

                            <div className="card-meta-row">
                                <div className="meta-item">
                                    <MapPin size={16} />
                                    <span>{internship.location || 'Remote'}</span>
                                </div>
                                <div className="meta-item">
                                    <Clock size={16} />
                                    <span>{internship.duration}</span>
                                </div>
                                <div className="meta-item">
                                    <DollarSign size={16} />
                                    <span>{internship.stipend}</span>
                                </div>
                            </div>

                            {internship.lastDateToApply && (
                                <div className="deadline-row" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} />
                                    <span>Last Date: {new Date(internship.lastDateToApply).toLocaleDateString()}</span>
                                    {new Date() < new Date(internship.lastDateToApply) ? (
                                        <span className="status-badge-open" style={{
                                            padding: '2px 8px',
                                            background: '#dcfce7',
                                            color: '#15803d',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            boxShadow: '0 0 8px rgba(34, 197, 94, 0.2)'
                                        }}>Open</span>
                                    ) : (
                                        <span className="status-badge-closed" style={{
                                            padding: '2px 8px',
                                            background: '#fee2e2',
                                            color: '#b91c1c',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>Closed</span>
                                    )}
                                </div>
                            )}

                            <p className="card-description">{internship.description}</p>

                            <div className="skills-row">
                                {internship.skills?.map((skill, index) => (
                                    <span key={index} className="skill-pill">{skill}</span>
                                ))}
                            </div>

                            <div className="card-bottom-row">
                                <span className="posted-time">Posted {new Date(internship.createdAt).toLocaleDateString()}</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {internship.lastDateToApply && new Date() > new Date(internship.lastDateToApply) ? (
                                        <button className="btn-view-details disabled" disabled style={{ background: '#e2e8f0', color: '#94a3b8', cursor: 'not-allowed' }}>Application Closed</button>
                                    ) : (
                                        <button className="btn-view-details" onClick={() => openApplyModal(internship)}>Apply Now</button>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                    {filteredInternships.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '50px 0' }}>No internships found.</div>
                    )}
                </div>
            )}

            {showModal && selectedInternship && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', position: 'relative' }}>
                        <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>

                        {applySuccess ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ background: '#dcfce7', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h2 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>Success!</h2>
                                <p style={{ color: '#475569' }}>You have successfully applied to {selectedInternship.title}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleApplySubmit}>
                                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Apply for {selectedInternship.title}</h2>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{selectedInternship.companyId?.companyName}</p>

                                {applyError && <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{applyError}</div>}

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Email</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Location</label>
                                    <input type="text" required placeholder="City, Country" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Highest Qualification</label>
                                    <input type="text" required placeholder="e.g. B.Tech Computer Science" value={formData.qualification} onChange={e => setFormData({ ...formData, qualification: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                                </div>

                                <button type="submit" disabled={applying} style={{ width: '100%', padding: '0.75rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: applying ? 'not-allowed' : 'pointer' }}>
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {showCompanyModal && selectedCompany && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: 'clamp(0.5rem, 2vw, 1rem)'
                }}>
                    <div className="company-profile-modal" style={{
                        background: 'white',
                        padding: 'clamp(1rem, 4vw, 2rem)',
                        borderRadius: 'clamp(8px, 2vw, 12px)',
                        width: '100%',
                        maxWidth: 'clamp(300px, 90vw, 600px)',
                        position: 'relative',
                        maxHeight: 'clamp(85vh, 90vh, 95vh)',
                        overflow: 'auto',
                        margin: 'clamp(0.5rem, 2vw, 1rem)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <button
                            onClick={() => setShowCompanyModal(false)}
                            style={{
                                position: 'absolute',
                                right: 'clamp(0.75rem, 2vw, 1rem)',
                                top: 'clamp(0.75rem, 2vw, 1rem)',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                padding: 'clamp(0.4rem, 1.5vw, 0.5rem)',
                                zIndex: 10,
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#e2e8f0';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#f8fafc';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            <X size={window.innerWidth < 480 ? 16 : 20} />
                        </button>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(0.75rem, 2vw, 1.5rem)',
                            marginBottom: 'clamp(1rem, 3vw, 2rem)',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            textAlign: 'center',
                            flexDirection: window.innerWidth < 480 ? 'column' : 'row'
                        }}>
                            <div style={{
                                width: 'clamp(60px, 20vw, 100px)',
                                height: 'clamp(60px, 20vw, 100px)',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                border: '2px solid white'
                            }}>
                                {selectedCompany.logo ? (
                                    <img
                                        src={selectedCompany.logo}
                                        alt={selectedCompany.companyName}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <Building size={window.innerWidth < 480 ? 24 : 40} color="#64748b" />
                                )}
                            </div>
                            <div style={{
                                flex: 1,
                                minWidth: '200px',
                                textAlign: 'center',
                                maxWidth: window.innerWidth < 480 ? '100%' : 'auto'
                            }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.2,
                                    marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)'
                                }}>
                                    {selectedCompany.companyName}
                                </h2>
                                <p style={{
                                    margin: 0,
                                    color: '#64748b',
                                    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                                    fontWeight: 500
                                }}>
                                    {selectedCompany.industry}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gap: 'clamp(0.75rem, 2vw, 1.25rem)',
                            marginBottom: 'clamp(1.5rem, 3vw, 2rem)',
                            padding: 'clamp(0.75rem, 2vw, 1rem)',
                            background: '#f8fafc',
                            borderRadius: 'clamp(8px, 2vw, 12px)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                                color: '#475569',
                                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                                padding: 'clamp(0.25rem, 1vw, 0.5rem)',
                                borderRadius: '6px',
                                background: 'white'
                            }}>
                                <MapPin size={window.innerWidth < 480 ? 14 : 18} color="#8b5cf6" />
                                <span style={{ wordBreak: 'break-word', fontWeight: 500 }}>
                                    {selectedCompany.location || 'Location not specified'}
                                </span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                                color: '#475569',
                                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                                padding: 'clamp(0.25rem, 1vw, 0.5rem)',
                                borderRadius: '6px',
                                background: 'white'
                            }}>
                                <Mail size={window.innerWidth < 480 ? 14 : 18} color="#8b5cf6" />
                                <span style={{ wordBreak: 'break-word', fontWeight: 500 }}>
                                    {selectedCompany.userId?.email || 'Email not available'}
                                </span>
                            </div>
                            {selectedCompany.website && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                                    color: '#475569',
                                    fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                                    padding: 'clamp(0.25rem, 1vw, 0.5rem)',
                                    borderRadius: '6px',
                                    background: 'white'
                                }}>
                                    <Globe size={window.innerWidth < 480 ? 14 : 18} color="#8b5cf6" />
                                    <a
                                        href={selectedCompany.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: '#3b82f6',
                                            textDecoration: 'none',
                                            wordBreak: 'break-word',
                                            fontWeight: 500,
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.color = '#2563eb'}
                                        onMouseOut={(e) => e.target.style.color = '#3b82f6'}
                                    >
                                        {selectedCompany.website}
                                    </a>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
                            <h3 style={{
                                margin: '0 0 clamp(0.75rem, 2vw, 1rem) 0',
                                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                                fontWeight: 600,
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>About Company</span>
                                <div style={{
                                    width: 'clamp(20px, 5vw, 30px)',
                                    height: '2px',
                                    background: '#8b5cf6',
                                    borderRadius: '1px'
                                }}></div>
                            </h3>
                            <p style={{
                                margin: 0,
                                color: '#475569',
                                lineHeight: '1.7',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                                textAlign: window.innerWidth < 480 ? 'justify' : 'left',
                                padding: 'clamp(0.75rem, 2vw, 1rem)',
                                background: '#fafafa',
                                borderRadius: 'clamp(6px, 2vw, 8px)',
                                borderLeft: '3px solid #8b5cf6'
                            }}>
                                {selectedCompany.description || 'No description available for this company.'}
                            </p>
                        </div>

                        <div style={{
                            padding: 'clamp(1rem, 2.5vw, 1.25rem)',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: 'clamp(8px, 2vw, 12px)',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0'
                        }}>
                            <p style={{
                                margin: 0,
                                color: '#64748b',
                                fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                flexWrap: 'wrap'
                            }}>
                                <span>Verification Status:</span>
                                <span style={{
                                    fontWeight: 700,
                                    padding: 'clamp(0.25rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1rem)',
                                    borderRadius: 'clamp(6px, 2vw, 8px)',
                                    background: selectedCompany.verificationStatus === 'approved' ? '#dcfce7' :
                                        selectedCompany.verificationStatus === 'pending' ? '#ffedd5' : '#fee2e2',
                                    color: selectedCompany.verificationStatus === 'approved' ? '#16a34a' :
                                        selectedCompany.verificationStatus === 'pending' ? '#ea580c' : '#dc2626',
                                    border: `1px solid ${selectedCompany.verificationStatus === 'approved' ? '#bbf7d0' :
                                            selectedCompany.verificationStatus === 'pending' ? '#fed7aa' : '#fecaca'
                                        }`
                                }}>
                                    {selectedCompany.verificationStatus?.toUpperCase() || 'UNKNOWN'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 480px) {
                    .modal-overlay {
                        padding: 0.5rem !important;
                    }
                    
                    .company-profile-modal {
                        margin: 0.5rem !important;
                        border-radius: 8px !important;
                    }
                }
                
                @media (max-width: 380px) {
                    .modal-overlay {
                        padding: 0.25rem !important;
                    }
                    
                    .company-profile-modal {
                        margin: 0.25rem !important;
                        padding: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Browse;
