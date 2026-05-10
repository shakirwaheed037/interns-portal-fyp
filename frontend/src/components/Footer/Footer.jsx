import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Twitter, Instagram, Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-brand-section">
                        <Link to="/" className="footer-brand">
                            <div className="brand-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="icon-svg">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 13v-3l10-5v3l-10 5zm0 5v-3l10-5v3l-10 5z" />
                                </svg>
                            </div>
                            <span>Interns</span>
                        </Link>
                        <p className="footer-description">
                            Connecting the next generation of talent with the world's most innovative companies.
                        </p>
                        <div className="footer-socials">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                                <Facebook size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                                <Instagram size={20} />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                                <Github size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer-links-grid">
                        <div className="footer-col">
                            <h4>Explore</h4>
                            <Link to="/browse">Internships</Link>
                            <Link to="/companies">Companies</Link>
                            <Link to="#">Universities</Link>
                        </div>
                        <div className="footer-col">
                            <h4>Support</h4>
                            <Link to="#">Help Center</Link>
                            <Link to="#">Privacy Policy</Link>
                            <Link to="#">Terms of Service</Link>
                        </div>
                        <div className="footer-newsletter">
                            <h4>Stay Updated</h4>
                            <form className="newsletter-form">
                                <input type="email" placeholder="Your email" required />
                                <button type="submit">Subscribe</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Interns.pk Inc. All rights reserved. | Developed by Shakir Waheed</p>
                    <div className="footer-bottom-links">
                        <Link to="#">Cookies</Link>
                        <Link to="#">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
