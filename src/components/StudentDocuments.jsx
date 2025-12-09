import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CertificateTemplates, CertificateTypes } from './certificates';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './certificates/certificates.css'; // Reuse existing styles

function StudentDocuments({ user, onLogout }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({ type: 'All', status: 'All', search: '' });
    const [selectedCert, setSelectedCert] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const certRef = useRef(null);

    useEffect(() => {
        fetchDocuments();
    }, [pagination.currentPage, filters.type, filters.status]); // Refetch when these change

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDocuments();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                page: pagination.currentPage,
                limit: 10,
                type: filters.type,
                status: filters.status,
                search: filters.search
            });

            const res = await fetch(`/api/students/${user.id}/certificates?${query}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setDocuments(data.data);
                setPagination(data.pagination);
            } else {
                console.error('Failed to fetch documents');
            }
        } catch (err) {
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 on filter change
    };

    const handlePreview = async (doc) => {
        // Fetch full details for preview (reusing existing endpoint)
        try {
            const res = await fetch(`/api/student/certificate/${doc.id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Fallbacks
                if (!data.student_name && data.student_username) data.student_name = data.student_username;
                if (!data.institute_name && data.institute_username) data.institute_name = data.institute_username;

                setSelectedCert(data);
                setShowPreview(true);
            } else {
                alert('Failed to load certificate details');
            }
        } catch (err) {
            console.error(err);
            alert('Error loading certificate');
        }
    };

    const handleDownload = async (doc) => {
        setDownloading(true);
        try {
            // Reusing the download logic from StudentDashboard would be ideal, 
            // but for now I'll duplicate the core logic or call a shared utility if I had one.
            // Since I don't want to refactor the whole App.jsx right now, I'll implement a simplified version here
            // that relies on the same backend endpoints.

            // Actually, let's just use the same logic as App.jsx's handleDownload
            // We need to fetch the full data first
            const res = await fetch(`/api/student/certificate/${doc.id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch certificate data');
            const data = await res.json();

            // Fallback for student_name if null (use username)
            if (!data.student_name && data.student_username) {
                data.student_name = data.student_username;
            }
            if (!data.institute_name && data.institute_username) {
                data.institute_name = data.institute_username;
            }

            // Generate QR Code
            let qrCodeUrl = '';
            if (data.certificate_hash) {
                try {
                    const qrRes = await fetch(`/api/qrcode/${data.certificate_hash}`, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    if (qrRes.ok) {
                        const qrData = await qrRes.json();
                        qrCodeUrl = qrData.qrCodeDataUrl;
                    }
                } catch (e) {
                    console.error('QR error', e);
                }
            }
            if (!qrCodeUrl) qrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

            // Map template type to filename
            const templateMap = {
                'Degree Certificate': 'degree.html',
                'Bonafide Certificate': 'bonafide.html',
                'Transfer Certificate': 'transfer.html',
                'Project Completion Certificate': 'project_completion.html',
                'NOC (No Objection Certificate)': 'noc.html',
                'Participation Certificate': 'participation.html',
                'Achievement Certificate': 'achievement.html'
            };

            const filename = templateMap[data.template_type];
            if (!filename) throw new Error('Template not found');

            // Fetch HTML template
            const templateRes = await fetch(`/templates/${filename}`);
            let htmlContent = await templateRes.text();

            // Fetch and inline CSS
            const cssRes = await fetch('/templates/styles.css');
            const cssContent = await cssRes.text();
            htmlContent = htmlContent.replace('<link rel="stylesheet" href="styles.css">', `<style>${cssContent}</style>`);

            // Replace placeholders
            const replacePlaceholders = (html, data, qrCode) => {
                let result = html;
                Object.keys(data).forEach(key => {
                    const placeholder = `{{${key}}}`;
                    const value = data[key] || '';
                    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
                });
                result = result.replace(/\{\{qrCode\}\}/g, qrCode);
                result = result.replace(/\{\{certificateId\}\}/g, data.certificate_hash || doc.id);
                result = result.replace(/\{\{transactionId\}\}/g, data.certificate_hash || 'N/A');
                return result;
            };

            htmlContent = replacePlaceholders(htmlContent, data, qrCodeUrl);

            const container = document.createElement('div');
            container.innerHTML = htmlContent;
            document.body.appendChild(container);

            const certificateElement = container.querySelector('#certificate');

            // Wait for images
            const images = certificateElement.querySelectorAll('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            const canvas = await html2canvas(certificateElement, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${data.template_type.replace(/ /g, '_')}_${doc.id}.pdf`);

            document.body.removeChild(container);
            setDownloading(false);

        } catch (e) {
            console.error(e);
            alert('Download failed: ' + e.message);
            setDownloading(false);
        }
    };

    const handleShare = (doc) => {
        if (doc.verificationUrl) {
            const fullUrl = `${window.location.origin}${doc.verificationUrl}`;
            navigator.clipboard.writeText(fullUrl);
            alert('Verification link copied to clipboard!');
        } else {
            alert('Certificate not yet valid for sharing.');
        }
    };

    const CertificateComponent = selectedCert ? CertificateTemplates[selectedCert.template_type] : null;

    return (
        <div className="dashboard">
            <header>
                <h1>My Documents</h1>
                <div className="user-info">
                    <Link to="/student" className="btn-secondary" style={{ marginRight: '10px' }}>Dashboard</Link>
                    <span>{user.name}</span>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </header>

            <div className="content">
                <section className="card">
                    <div className="controls" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Search certificates..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            style={{ padding: '8px', flex: 1 }}
                        />
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            style={{ padding: '8px' }}
                        >
                            <option value="All">All Types</option>
                            {CertificateTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            style={{ padding: '8px' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading documents...</p>
                    ) : (
                        <>
                            <table className="documents-table">
                                <thead>
                                    <tr>
                                        <th>Certificate</th>
                                        <th>Institute</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.length > 0 ? (
                                        documents.map(doc => (
                                            <tr key={doc.id}>
                                                <td>
                                                    <div style={{ fontWeight: 'bold' }}>{doc.template_type}</div>
                                                    <div style={{ fontSize: '0.8em', color: '#666' }}>{doc.template_name}</div>
                                                </td>
                                                <td>{doc.institute_name}</td>
                                                <td>{new Date(doc.request_date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status ${doc.status.toLowerCase()}`}>
                                                        {doc.badge}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
                                                        {doc.status === 'Approved' && (
                                                            <>
                                                                <button onClick={() => handlePreview(doc)} title="Preview">👁️</button>
                                                                <button onClick={() => handleDownload(doc)} disabled={downloading} title="Download">⬇️</button>
                                                                <button onClick={() => handleShare(doc)} title="Share">🔗</button>
                                                            </>
                                                        )}
                                                        {doc.status === 'Pending' && <span style={{ color: '#888' }}>Processing</span>}
                                                        {doc.status === 'Rejected' && <span style={{ color: 'red' }}>Revoked</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center' }}>No documents found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <button
                                        disabled={pagination.currentPage === 1}
                                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                    >
                                        Previous
                                    </button>
                                    <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                                    <button
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>

            {/* Preview Modal */}
            {showPreview && selectedCert && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '90%', maxHeight: '90%', overflow: 'auto', position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowPreview(false)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '1.5em', cursor: 'pointer' }}
                        >
                            &times;
                        </button>
                        <h2>Certificate Preview</h2>
                        <div className="preview-container" style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                            {/* We can use the React component for preview if available, or just show details */}
                            {CertificateComponent ? (
                                <CertificateComponent data={selectedCert} />
                            ) : (
                                <p>Preview not available for this type.</p>
                            )}
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button onClick={() => handleDownload(selectedCert)} disabled={downloading}>Download PDF</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentDocuments;
