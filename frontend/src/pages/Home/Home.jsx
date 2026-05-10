import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, ListChecks, CheckCircle2, User, Search, Send } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="trusted-badge">
                        TRUSTED BY 10,000+ STUDENTS
                    </div>
                    <h1 className="hero-title">
                        Find and apply to verified internships <span className="highlight-text">easily</span>
                    </h1>
                    <p className="hero-subtitle">
                        Kickstart your career with thousands of curated opportunities from top-tier companies. Verified roles, direct applications, and real-time tracking.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn-primary">Get Started</Link>
                        <Link to="/companies" className="btn-secondary">Browse Companies</Link>
                    </div>
                </div>
                <div className="hero-image-wrapper">
                    <div className="hero-image-glow"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="Students collaborating" 
                        className="hero-image"
                    />
                </div>
            </section>

            {/* Core Benefits */}
            <section className="benefits-section">
                <div className="section-header">
                    <span className="section-label">CORE BENEFITS</span>
                    <h2 className="section-title">Why Choose Our Platform?</h2>
                </div>
                
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon-wrapper">
                            <Shield className="benefit-icon" />
                        </div>
                        <h3>Verified Companies</h3>
                        <p>Every company is manually vetted for your safety. No scams, only genuine career opportunities.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon-wrapper">
                            <Zap className="benefit-icon" />
                        </div>
                        <h3>Easy Application</h3>
                        <p>Apply to multiple roles with a single profile. Fast, seamless, and mobile-friendly application flow.</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon-wrapper">
                            <ListChecks className="benefit-icon" />
                        </div>
                        <h3>Track Progress</h3>
                        <p>Real-time updates on your application status. Know exactly where you stand in the process.</p>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="how-it-works-section">
                <div className="section-header">
                    <h2 className="section-title">How it Works</h2>
                    <p className="section-subtitle">Get your dream internship in three simple steps</p>
                </div>

                <div className="timeline-container">
                    <div className="timeline-line"></div>
                    
                    {/* Step 1 */}
                    <div className="timeline-step">
                        <div className="step-content text-right">
                            <h3>Create Profile</h3>
                            <p>Sign up and build your professional portfolio with your skills and education.</p>
                        </div>
                        <div className="step-number">1</div>
                        <div className="step-graphic">
                            <div className="graphic-card">
                                <User className="graphic-icon" />
                                <div className="graphic-lines">
                                    <div className="line-long"></div>
                                    <div className="line-short"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="timeline-step reverse">
                        <div className="step-content text-left">
                            <h3>Find Opportunities</h3>
                            <p>Search for internships that match your interests and career goals.</p>
                        </div>
                        <div className="step-number">2</div>
                        <div className="step-graphic">
                            <div className="graphic-card">
                                <Search className="graphic-icon" />
                                <div className="graphic-lines">
                                    <div className="line-long"></div>
                                    <div className="line-short"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="timeline-step">
                        <div className="step-content text-right">
                            <h3>Direct Apply</h3>
                            <p>Submit your application directly and track it in real-time until you're hired.</p>
                        </div>
                        <div className="step-number">3</div>
                        <div className="step-graphic">
                            <div className="graphic-card">
                                <Send className="graphic-icon" />
                                <div className="graphic-buttons">
                                    <div className="btn-skeleton-light"></div>
                                    <div className="btn-skeleton-primary"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Cards */}
            <section className="cta-section">
                <div className="cta-grid">
                    {/* Student CTA */}
                    <div className="cta-card student-cta">
                        <span className="cta-label student-label">For Students</span>
                        <h3>Land your dream internship</h3>
                        <p>Gain access to exclusive roles from top companies across technology, finance, marketing, and more.</p>
                        <ul className="cta-features">
                            <li><CheckCircle2 className="check-icon" /> Free professional resume builder</li>
                            <li><CheckCircle2 className="check-icon" /> Real-time status notifications</li>
                            <li><CheckCircle2 className="check-icon" /> Interview prep resources</li>
                        </ul>
                        <Link to="/register?role=student" className="btn-primary cta-btn">Find a Role</Link>
                    </div>

                    {/* Company CTA */}
                    <div className="cta-card company-cta">
                        <span className="cta-label company-label">For Companies</span>
                        <h3>Find the best talent</h3>
                        <p>Connect with ambitious students from top universities. Manage your internship program with ease.</p>
                        <ul className="cta-features">
                            <li><CheckCircle2 className="check-icon" /> Verified student database</li>
                            <li><CheckCircle2 className="check-icon" /> Automated screening tools</li>
                            <li><CheckCircle2 className="check-icon" /> Seamless onboarding flow</li>
                        </ul>
                        <Link to="/register?role=company" className="btn-primary cta-btn">Post an Internship</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
