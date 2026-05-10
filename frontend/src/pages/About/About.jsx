import React from 'react';
import { Users, Building2, ShieldCheck, Target, Eye, Database, Server, Cpu, Globe } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            {/* HERO SECTION */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-hero-title">About Interns Portal</h1>
                    <p className="about-hero-subtitle">
                        Connecting Students with Opportunities and Companies with Talent
                    </p>
                </div>
                <div className="about-hero-blob"></div>
            </section>

            {/* PLATFORM DESCRIPTION */}
            <section className="about-description-section">
                <div className="container-responsive">
                    <div className="description-card">
                        <div className="description-icon">
                            <Globe size={40} strokeWidth={1.5} />
                        </div>
                        <div className="description-text">
                            <h2>Bridging the Gap</h2>
                            <p>
                                Interns Portal is a comprehensive platform designed to streamline the internship 
                                search and recruitment process. We believe that every student deserves a chance 
                                to gain real-world experience, and every company deserves access to fresh, 
                                motivated talent. Our system provides a centralized hub for all internship-related activities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="about-features">
                <div className="container-responsive">
                    <div className="section-header">
                        <span className="section-label">Core Features</span>
                        <h2 className="section-title">Designed for Everyone</h2>
                    </div>
                    <div className="features-grid">
                        {/* Students Card */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper students-icon">
                                <Users size={28} />
                            </div>
                            <h3>Students</h3>
                            <ul className="feature-list">
                                <li>Browse internships</li>
                                <li>Apply easily</li>
                                <li>Track applications</li>
                            </ul>
                        </div>

                        {/* Companies Card */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper companies-icon">
                                <Building2 size={28} />
                            </div>
                            <h3>Companies</h3>
                            <ul className="feature-list">
                                <li>Post internships</li>
                                <li>Manage applicants</li>
                                <li>Hire talent</li>
                            </ul>
                        </div>

                        {/* Admin Card */}
                        <div className="feature-card">
                            <div className="feature-icon-wrapper admin-icon">
                                <ShieldCheck size={28} />
                            </div>
                            <h3>Admin</h3>
                            <ul className="feature-list">
                                <li>Verify users</li>
                                <li>Manage platform</li>
                                <li>Ensure security</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="about-mission-vision">
                <div className="container-responsive">
                    <div className="mission-vision-grid">
                        <div className="mv-card mission-card">
                            <div className="mv-icon">
                                <Target size={32} />
                            </div>
                            <h3>Our Mission</h3>
                            <p>Empowering students and connecting them with real-world opportunities.</p>
                        </div>
                        <div className="mv-card vision-card">
                            <div className="mv-icon">
                                <Eye size={32} />
                            </div>
                            <h3>Our Vision</h3>
                            <p>Building a bridge between education and industry.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TECH STACK */}
            <section className="about-tech-stack">
                <div className="container-responsive">
                    <div className="section-header">
                        <span className="section-label">Our Foundation</span>
                        <h2 className="section-title">Modern Tech Stack</h2>
                    </div>
                    <div className="tech-badges">
                        <div className="tech-badge">
                            <Database size={20} />
                            <span>MongoDB</span>
                        </div>
                        <div className="tech-badge">
                            <Server size={20} />
                            <span>Express.js</span>
                        </div>
                        <div className="tech-badge">
                            <Cpu size={20} />
                            <span>React.js</span>
                        </div>
                        <div className="tech-badge">
                            <Cpu size={20} />
                            <span>Node.js</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
