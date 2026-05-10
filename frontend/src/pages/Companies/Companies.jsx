import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Plus, MapPin, Users, Star, ArrowRight, CodeSquare, CheckCircle2, Landmark, ChevronLeft, ChevronRight, PlusSquare, Rocket, Building2, Recycle } from 'lucide-react';
import api from '../../utils/api';
import './Companies.css';

const Companies = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyInternships, setCompanyInternships] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
    const [isIndustryOpen, setIsIndustryOpen] = useState(false);

    const industries = [
        'All Industries',
        'Software & Technology',
        'Finance & Banking',
        'Healthcare',
        'Education',
        'Marketing',
        'Engineering',
        'Design'
    ];

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('/companies');
                setCompanies(res.data);
            } catch (err) {
                console.error('Error fetching companies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const openProfileModal = async (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
        try {
            // Fetch all internships and filter by this company
            const res = await api.get('/internships');
            const companyJobs = res.data.filter(job => job.companyId?._id === company._id);
            setCompanyInternships(companyJobs);
        } catch (err) {
            console.error('Error fetching internships for company', err);
        }
    };

    const filteredCompanies = companies.filter((c) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (
            (c.companyName && c.companyName.toLowerCase().includes(searchLower)) ||
            (c.industry && c.industry.toLowerCase().includes(searchLower)) ||
            (c.location && c.location.toLowerCase().includes(searchLower))
        );
        const matchesIndustry = selectedIndustry === 'All Industries' || c.industry === selectedIndustry;
        return matchesSearch && matchesIndustry;
    });

    const colors = ['#5C67FA', '#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#14b8a6'];

    return (
        <div className="companies-page-wrapper">
            <div className="companies-page-top">
                <div className="title-area">
                    <h1>Companies Directory</h1>
                    <p>Explore industry leaders and their career opportunities.</p>
                </div>
            </div>

            <div className="companies-filter-bar">
                <div className="comp-search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, industry or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="comp-dropdowns">
                    <div className="custom-dropdown-container">
                        <button
                            className={`dropdown-btn ${selectedIndustry !== 'All Industries' ? 'active' : ''}`}
                            onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                        >
                            {selectedIndustry} <ChevronDown size={14} className={isIndustryOpen ? 'rotate' : ''} />
                        </button>
                        {isIndustryOpen && (
                            <div className="dropdown-list-portal">
                                {industries.map((ind, i) => (
                                    <div
                                        key={i}
                                        className={`dropdown-list-item ${selectedIndustry === ind ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedIndustry(ind);
                                            setIsIndustryOpen(false);
                                        }}
                                    >
                                        {ind}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading companies...</div>
            ) : (
                <div className="companies-grid">
                    {filteredCompanies.map((company, index) => {
                        const color = colors[index % colors.length];
                        return (
                            <div
                                key={company._id}
                                className="company-grid-card"
                                style={{ "--accent-color": color }}
                            >
                                <div className="card-topline"></div>
                                <div className="comp-card-header">
                                    <div className="comp-icon-wrapper" style={{ background: company.logo ? 'transparent' : `${color}15`, padding: company.logo ? '0' : '8px' }}>
                                        {company.logo ? (
                                            <img src={company.logo} alt="Logo" className="comp-card-logo" />
                                        ) : (
                                            <Building2 size={24} color={color} />
                                        )}
                                    </div>
                                    <div className="rating-badge">
                                        <Star size={12} fill="currentColor" /> {company.rating || 4.5}
                                    </div>
                                </div>

                                <h2>
                                    {company.companyName}
                                    {company.verified && (
                                        <span className="verified-badge" style={{ backgroundColor: '#dcfce7', color: '#000000ff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '8px', verticalAlign: 'middle' }}>
                                            <CheckCircle2 size={12} /> Verified
                                        </span>
                                    )}
                                </h2>
                                <div className="company-tags">
                                    <span className={`company-type-tag ${company.type?.toLowerCase().replace(/\s+/g, '-') || 'software-house'}`} style={{ backgroundColor: '#f1f5f9', color: '#000000ff', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {company.type || 'Software House'}
                                    </span>
                                    <span className="industry-pill">{company.industry || 'Tech'}</span>
                                </div>
                                <p className="comp-desc" style={{ minHeight: '60px' }}>
                                    {company.description || 'Leading enterprise provider specializing in modern infrastructure.'}
                                </p>

                                <div className="comp-meta">
                                    <div className="comp-meta-item">
                                        <MapPin size={14} />
                                        <span>{company.location || 'Remote'}</span>
                                    </div>
                                </div>

                                <button className="btn-view-profile" onClick={() => openProfileModal(company)}>
                                    View Company Profile <ArrowRight size={16} />
                                </button>
                            </div>
                        );
                    })}
                    {filteredCompanies.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 0' }}>
                            No companies found matching your search.
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && selectedCompany && (
                <div className="company-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="company-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <div className="modal-header-flex">
                            <img src={selectedCompany.logo || 'https://i.pravatar.cc/150?img=11'} alt="Logo" className="modal-logo" />
                            <div className="modal-title-info">
                                <h2>
                                    {selectedCompany.companyName}
                                    {selectedCompany.verified && (
                                        <span className="verified-badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '8px', verticalAlign: 'middle' }}>
                                            <CheckCircle2 size={12} /> Verified
                                        </span>
                                    )}
                                </h2>
                                <div className="company-tags">
                                    <span className={`company-type-tag ${selectedCompany.type?.toLowerCase().replace(/\s+/g, '-') || 'software-house'}`} style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {selectedCompany.type || 'Software House'}
                                    </span>
                                    <span className="modal-industry-tag">{selectedCompany.industry}</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-body-section">
                            <h4>About Company</h4>
                            <p>{selectedCompany.description || 'No description available for this company.'}</p>

                            <div className="modal-meta-row">
                                <div className="meta-item"><MapPin size={16} /> {selectedCompany.location || 'Remote'}</div>
                                {selectedCompany.website && <div className="meta-item"><Landmark size={16} /> <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">{selectedCompany.website}</a></div>}
                            </div>

                            <h4 className="mt-8">Internships Posted</h4>
                            <div className="modal-internship-list">
                                {companyInternships.length > 0 ? (
                                    companyInternships.map(job => (
                                        <div key={job._id} className="modal-job-item">
                                            <div className="job-info">
                                                <h5>{job.title}</h5>
                                                <p>{job.duration} • {job.stipend}</p>
                                            </div>
                                            <Link to="/student-dashboard/browse" className="btn-apply-sm">Apply Now</Link>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-grey-sm">No active internships posted by this company yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Companies;
