import React from 'react';
import CertificateLayout from './CertificateLayout';

const BonafideCertificate = ({ data }) => {
    return (
        <CertificateLayout className="bonafide-certificate">
            <div className="header">
                <div className="logo-placeholder">LOGO</div>
                <div className="institute-name">{data.institute_name}</div>
            </div>

            <div className="body">
                <h1 className="title">Bonafide Certificate</h1>

                <p className="text" style={{ marginTop: '40px', textAlign: 'justify', padding: '0 40px' }}>
                    This is to certify that <strong>{data.student_name}</strong> is a bonafide student of this institution,
                    studying in <strong>{data.template_name}</strong> during the academic year 2024-2025.
                </p>

                <p className="text" style={{ marginTop: '20px', textAlign: 'justify', padding: '0 40px' }}>
                    His/Her character and conduct during the period of study have been found to be good.
                    This certificate is issued on request for the purpose of <strong>General Reference</strong>.
                </p>
            </div>

            <div className="footer">
                <div className="date-block" style={{ textAlign: 'left' }}>
                    <p>Date: {new Date(data.request_date).toLocaleDateString()}</p>
                    <p>Place: Campus</p>
                </div>

                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Principal / Head of Institution</div>
                </div>
            </div>
        </CertificateLayout>
    );
};

export default BonafideCertificate;
