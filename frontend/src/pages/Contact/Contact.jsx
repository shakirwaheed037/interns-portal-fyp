import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, message } = formData;
        
        // Professional email format
        const subject = `Inquiry from ${name} via Interns.pk`;
        const body = `Hello Shakir,\n\nYou have received a new message from the contact form:\n\n` +
                     `Name: ${name}\n` +
                     `Email: ${email}\n\n` +
                     `Message:\n${message}\n\n` +
                     `Regards,\nInterns.pk Contact System`;

        // Opens default email client (Gmail/Outlook)
        window.location.href = `mailto:shakirwaheed105@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        alert('Your email client will now open to send the message to shakirwaheed105@gmail.com');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-page-wrapper">
            <div className="contact-container">
                <div className="contact-grid">
                    {/* LEFT SIDE: INFO */}
                    <div className="contact-info-section">
                        <div className="info-content">
                            <h1 className="contact-title">Get in Touch</h1>
                            <p className="contact-description">
                                Have questions or need assistance? We're here to help.
                                Reach out to us through the form or using the contact information below.
                            </p>

                            <div className="info-items">
                                <div className="info-item">
                                    <div className="info-icon">
                                        <Mail size={24} />
                                    </div>
                                    <div className="info-text">
                                        <h4>Email Us</h4>
                                        <p>shakirwaheed105@gmail.com</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon">
                                        <Phone size={24} />
                                    </div>
                                    <div className="info-text">
                                        <h4>Call Us</h4>
                                        <p>+92 3316708756</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="info-text">
                                        <h4>Our Location</h4>
                                        <p>Peshawar, Khyber Pakhtunkhwa, Pakistan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contact-decoration-blob"></div>
                    </div>

                    {/* RIGHT SIDE: FORM */}
                    <div className="contact-form-section">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Your Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="contact-submit-btn">
                                <span>Send Message</span>
                                <Send size={20} className="send-icon" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
