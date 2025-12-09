import React from 'react';
import CertificateLayout from './CertificateLayout';

const ParticipationCertificate = ({ data }) => {
    return (
        <CertificateLayout className="participation-certificate">
            <div className="header">
                <div className="logo-placeholder">LOGO</div>
                <div className="institute-name">{data.institute_name}</div>
            </div>

            <div className="body">
                <h1 className="title">Certificate of Participation</h1>

                <p className="text">
                    This is to certify that
                </p>

                <h2 className="student-name">{data.student_name}</h2>

                <p className="text">
                    has actively participated in
                </p>

                <h3 className="course-name">{data.template_name}</h3>

                <p className="text">
                    held on {new Date(data.request_date).toLocaleDateString()}.
                </p>
            </div>

            <div className="footer">
                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Coordinator</div>
                </div>

                <div className="date-block">
                    {data.qrCode && <img src={data.qrCode} alt="QR Code" className="qr-code" />}
                </div>

                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Principal</div>
                </div>
            </div>
        </CertificateLayout>
    );
};

export default ParticipationCertificate;
