import React from 'react';
import CertificateLayout from './CertificateLayout';

const NOC = ({ data }) => {
    return (
        <CertificateLayout className="noc-certificate">
            <div className="header">
                <div className="logo-placeholder">LOGO</div>
                <div className="institute-name">{data.institute_name}</div>
                <div className="institute-address">NO OBJECTION CERTIFICATE</div>
            </div>

            <div className="body">
                <p className="text" style={{ textAlign: 'justify', lineHeight: '2', padding: '0 40px' }}>
                    This is to certify that we have no objection to <strong>{data.student_name}</strong>,
                    who is a student/employee of this institution, participating in <strong>{data.template_name}</strong>.
                </p>

                <p className="text" style={{ textAlign: 'justify', lineHeight: '2', padding: '0 40px', marginTop: '20px' }}>
                    This certificate is issued upon his/her request and does not involve any financial liability on our part.
                </p>
            </div>

            <div className="footer">
                <div className="date-block" style={{ textAlign: 'left' }}>
                    <p>Date: {new Date(data.request_date).toLocaleDateString()}</p>
                    <p>Ref No: NOC/{data.id || '000'}</p>
                </div>

                <div className="signature-block">
                    <div className="signature-line"></div>
                    <div className="signatory">Authorized Signatory</div>
                </div>
            </div>
        </CertificateLayout>
    );
};

export default NOC;
