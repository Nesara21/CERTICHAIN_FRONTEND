import React from 'react';
import CertificateLayout from './CertificateLayout';

const TransferCertificate = ({ data }) => {
    return (
        <CertificateLayout className="transfer-certificate">
            <div className="header">
                <div className="logo-placeholder">LOGO</div>
                <div className="institute-name">{data.institute_name}</div>
                <div className="institute-address">TRANSFER CERTIFICATE</div>
            </div>

            <div className="body">
                <div style={{ textAlign: 'left', margin: '20px 60px', lineHeight: '2' }}>
                    <p><strong>Name of Student:</strong> {data.student_name}</p>
                    <p><strong>Course Studied:</strong> {data.template_name}</p>
                    <p><strong>Admission No:</strong> {data.student_id || 'N/A'}</p>
                    <p><strong>Date of Leaving:</strong> {new Date(data.request_date).toLocaleDateString()}</p>
                    <p><strong>Reason for Leaving:</strong> Course Completed</p>
                    <p><strong>Conduct:</strong> Good</p>
                </div>
            </div>

            <div className="footer">
                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Clerk</div>
                </div>

                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Principal</div>
                </div>
            </div>
        </CertificateLayout>
    );
};

export default TransferCertificate;
