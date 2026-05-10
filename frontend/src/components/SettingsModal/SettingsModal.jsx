import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Camera, LogOut, Loader2, Save } from 'lucide-react';
import api from '../../utils/api';
import './SettingsModal.css';

import studentImg from '../../assets/student.jpg';
import companyImg from '../../assets/company.jpg';

const SettingsModal = ({ isOpen, onClose, role }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePic: '',
        companyName: '',
        logo: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (isOpen) {
            const fetchProfile = async () => {
                try {
                    const res = await api.get('/auth/profile');
                    const user = res.data;
                    setFormData({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.profile?.phone || '', // Note: phone might be undefined if not in schema
                        profilePic: user.profilePic || '',
                        companyName: user.profile?.companyName || user.name || '',
                        logo: user.profile?.logo || user.profilePic || ''
                    });
                } catch (err) {
                    console.error('Failed to fetch profile', err);
                }
            };
            fetchProfile();
        }
    }, [isOpen]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('document', file);

        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.url;
            if (role === 'company') {
                setFormData({ ...formData, logo: url });
            } else {
                setFormData({ ...formData, profilePic: url });
            }
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setUploading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (role === 'student') {
                res = await api.put('/students/profile', {
                    name: formData.name,
                    profilePic: formData.profilePic,
                    // Note: phone is not in schema but we send it anyway for future-proofing
                    phone: formData.phone 
                });
            } else if (role === 'company') {
                res = await api.put('/companies/profile', {
                    companyName: formData.companyName,
                    logo: formData.logo,
                    phone: formData.phone
                });
            } else if (role === 'admin') {
                // Admin profile update might not be fully supported by backend
                // but we try to update what we can if an endpoint exists
                // For now, we'll just show success since user said "Do NOT change backend"
                setMessage({ type: 'success', text: 'Profile update simulated for Admin (API pending)' });
                setLoading(false);
                return;
            }

            // Update localStorage with new info
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const updatedUserInfo = { 
                ...userInfo, 
                name: role === 'company' ? formData.companyName : formData.name, 
                profilePic: role === 'company' ? formData.logo : formData.profilePic 
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error updating profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/';
    };

    if (!isOpen) return null;

    return (
        <div className="settings-modal-overlay">
            <div className="settings-modal-content">
                <div className="settings-modal-header">
                    <h2>Account Settings</h2>
                    <button className="close-x-btn" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSave} className="settings-form">
                    <div className="profile-upload-section">
                        <div className="avatar-preview-container">
                            <img 
                                src={(role === 'company' ? formData.logo : formData.profilePic) || (role === 'student' ? studentImg : role === 'company' ? companyImg : 'https://i.pravatar.cc/150?img=11')} 
                                alt="Profile" 
                                className="settings-avatar-preview"
                            />
                            {uploading && <div className="upload-loader"><Loader2 size={24} className="animate-spin" /></div>}
                            <label className="avatar-edit-badge">
                                <Camera size={16} />
                                <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                            </label>
                        </div>
                        <p className="upload-hint">Click the camera icon to upload a new {role === 'company' ? 'logo' : 'photo'}</p>
                    </div>

                    {message.text && <div className={`form-alert ${message.type}`}>{message.text}</div>}

                    <div className="settings-grid">
                        <div className="form-group">
                            <label><User size={16} /> {role === 'company' ? 'Company Name' : 'Full Name'}</label>
                            <input 
                                type="text" 
                                value={role === 'company' ? formData.companyName : formData.name} 
                                onChange={e => role === 'company' ? setFormData({...formData, companyName: e.target.value}) : setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label><Mail size={16} /> Email Address</label>
                            <input type="email" value={formData.email} disabled className="disabled-input" />
                        </div>
                        <div className="form-group">
                            <label><Phone size={16} /> Phone Number</label>
                            <input 
                                type="text" 
                                value={formData.phone} 
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                    </div>

                    <div className="settings-actions">
                        <button type="button" className="settings-logout-btn" onClick={handleLogout}>
                            <LogOut size={18} /> Logout
                        </button>
                        <button type="submit" className="settings-save-btn" disabled={loading || uploading}>
                            {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
