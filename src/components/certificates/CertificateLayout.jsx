import React from 'react';
import './certificates.css';

const CertificateLayout = ({ children, className = '' }) => {
    return (
        <div className={`certificate-container ${className}`}>
            <div className="certificate-border">
                <div className="certificate-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CertificateLayout;
