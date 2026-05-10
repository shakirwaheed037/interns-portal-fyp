import React from 'react';
import './Preloader.css';

const Preloader = () => {
    return (
        <div className="preloader-overlay">
            <div className="preloader-content">
                <div className="spinner-wrapper">
                    <div className="main-spinner"></div>
                    <div className="inner-spinner"></div>
                </div>
                <div className="loading-text">
                    <span className="char">I</span>
                    <span className="char">N</span>
                    <span className="char">T</span>
                    <span className="char">E</span>
                    <span className="char">R</span>
                    <span className="char">N</span>
                    <span className="char">S</span>
                    <span className="char">.</span>
                    <span className="char">P</span>
                    <span className="char">K</span>
                </div>
                <div className="loading-bar">
                    <div className="loading-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
