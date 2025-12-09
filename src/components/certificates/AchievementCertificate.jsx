import React from 'react';
import CertificateLayout from './CertificateLayout';

const AchievementCertificate = ({ data }) => {
    return (
        <CertificateLayout className="achievement-certificate">
            <div className="header">
                <div className="logo-placeholder">LOGO</div>
                <div className="institute-name">{data.institute_name}</div>
            </div>

            <div className="body">
                <h1 className="title" style={{ color: '#d4af37' }}>Certificate of Achievement</h1>

                <p className="text">
                    This certificate is awarded to
                </p>

                <h2 className="student-name">{data.student_name}</h2>

                <p className="text">
                    in recognition of outstanding performance in
                </p>

                <h3 className="course-name">{data.template_name}</h3>

                <p className="text">
                    We commend your dedication and excellence.
                </p>
            </div>

            <div className="footer">
                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Director</div>
                </div>

                <div className="date-block">
                    {data.qrCode && <img src={data.qrCode} alt="QR Code" className="qr-code" />}
                    <p>Date: {new Date(data.request_date).toLocaleDateString()}</p>
                </div>

                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Chairman</div>
                </div>
            </div>
        </CertificateLayout>
    );
};

export default AchievementCertificate;
