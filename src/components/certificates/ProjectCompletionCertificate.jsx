import React from 'react';
import CertificateLayout from './CertificateLayout';

const ProjectCompletionCertificate = ({ data }) => {
    return (
        <CertificateLayout className="project-certificate">
            <div className="header">
                <div className="logo-placeholder">LOGO</div>
                <div className="institute-name">{data.institute_name}</div>
            </div>

            <div className="body">
                <h1 className="title">Project Completion Certificate</h1>

                <p className="text">
                    This is to certify that
                </p>

                <h2 className="student-name">{data.student_name}</h2>

                <p className="text">
                    has successfully completed the project titled
                </p>

                <h3 className="course-name" style={{ fontStyle: 'italic' }}>"{data.template_name}"</h3>

                <p className="text">
                    as part of the curriculum requirements.
                </p>

                {data.description && <p className="description" style={{ marginTop: '20px', fontStyle: 'italic' }}>Project Description: {data.description}</p>}
            </div>

            <div className="footer">
                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Project Guide</div>
                </div>

                <div className="date-block">
                    {data.qrCode && <img src={data.qrCode} alt="QR Code" className="qr-code" />}
                    <p>Date: {new Date(data.request_date).toLocaleDateString()}</p>
                </div>

                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">HOD</div>
                </div>
            </div>
        </CertificateLayout>
    );
};

export default ProjectCompletionCertificate;
