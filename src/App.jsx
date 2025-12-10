import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CertificateTemplates, CertificateTypes } from './components/certificates';
import StudentDocuments from './components/StudentDocuments';
import InstituteAnalytics from './components/InstituteAnalytics';
import './components/certificates/certificates.css';

// --- Components (Inline for now, will separate later) ---

function LandingPage() {
    return (
        <div className="landing">
            <div className="hero">
                <h1>Welcome to CertiChain</h1>
                <p>Secure Certificate Management System</p>
                <div className="cta-group">
                    <div className="cta-card">
                        <h3>For Students</h3>
                        <p>Request and download your certificates.</p>
                        <div className="btn-group">
                            <Link to="/login/student" className="btn-primary">Student Login</Link>
                            <Link to="/signup" className="btn-secondary">Sign Up</Link>
                        </div>
                    </div>
                    <div className="cta-card">
                        <h3>For Institutes</h3>
                        <p>Issue and manage certificates.</p>
                        <div className="btn-group">
                            <Link to="/login/institute" className="btn-primary">Institute Login</Link>
                            <Link to="/signup/institute" className="btn-secondary">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Login({ onLogin, expectedRole }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            // ENHANCED DEBUG LOGGING
            console.log('=== LOGIN DEBUG START ===');
            console.log('Data -> ',data);
            console.log('1. Full response data:', JSON.stringify(data, null, 2));
            console.log('2. Expected role:', expectedRole);
            console.log('3. Actual role from server:', data.role);
            console.log('4. Role type:', typeof data.role);
            console.log('5. Role has whitespace?', data.role !== data.role.trim());
            console.log('6. Role comparison (institute):', data.role === 'institute');
            console.log('7. Role comparison (student):', data.role === 'student');

            if (res.ok) {
                // Check if role matches expected
                if (expectedRole && data.role !== expectedRole) {
                    console.log('8. ❌ ROLE MISMATCH - Expected:', expectedRole, 'Got:', data.role);
                    setError(`Please login as ${expectedRole}`);
                    return;
                }

                console.log('9. ✅ Role check passed, calling onLogin');
                onLogin(data);

                // Determine target path
                const targetPath = data.role === 'institute' ? '/institute' : '/student';
                console.log('10. Target path determined:', targetPath);
                console.log('11. Navigating to:', targetPath);
                console.log('=== LOGIN DEBUG END ===');

                navigate(targetPath);
            } else {
                console.log('8. ❌ Login failed:', data.error);
                setError(data.error);
            }
        } catch (err) {
            console.error('9. ❌ Exception during login:', err);
            setError('Login failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <p><Link to="/forgot-password">Forgot Password?</Link></p>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            <p><Link to="/">Back to Home</Link></p>
        </div>
    );
}

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email, role: 'student' }),
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/login/student');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Student Signup</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            <p><Link to="/">Back to Home</Link></p>
        </div>
    );
}

function InstituteSignup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email, role: 'institute' }),
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/login/institute');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Institute Registration</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input placeholder="Official Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Register Institute</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            <p>Student? <Link to="/signup">Sign up here</Link></p>
            <p><Link to="/">Back to Home</Link></p>
        </div>
    );
}

function InstituteDashboard({ user, onLogout }) {
    const [templates, setTemplates] = useState([]);
    const [requests, setRequests] = useState([]);
    const [newTemplate, setNewTemplate] = useState({ template_type: 'Bonafide Certificate' });

    useEffect(() => {
        fetchTemplates();
        fetchRequests();
    }, []);

    const fetchTemplates = async () => {
        const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/institute/templates', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) setTemplates(await res.json());
    };

    const fetchRequests = async () => {
        const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/institute/requests', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) setRequests(await res.json());
    };

    const createTemplate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/institute/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(newTemplate)
            });

            if (res.ok) {
                setNewTemplate({ template_type: 'Bonafide Certificate' });
                fetchTemplates();
                alert('Template created successfully');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create template');
            }
        } catch (err) {
            alert('An error occurred');
        }
    };

    const handleRequest = async (id, status) => {
        try {
            const res = await fetch(`https://certichain-backend-x2zk.onrender.com/api/institute/requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchRequests();
                alert(`Request ${status} successfully`);
            } else {
                const data = await res.json();
                alert(data.error || 'Action failed');
            }
        } catch (err) {
            alert('Network error or server failed');
        }
    };

    return (
        <div className="dashboard">
            <header>
                <h1>Institute Dashboard</h1>
                <div className="user-info">
                    <Link to="/institute/analytics" className="btn-secondary" style={{ marginRight: '10px' }}>Analytics</Link>
                    <span>{user.name}</span>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </header>

            <div className="content">
                <section className="card">
                    <h3>Create Certificate Template</h3>
                    <form onSubmit={createTemplate}>
                        <select
                            value={newTemplate.template_type}
                            onChange={e => setNewTemplate({ ...newTemplate, template_type: e.target.value })}
                        >
                            {CertificateTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <button type="submit">Create Template</button>
                    </form>

                    <h4>Existing Templates</h4>
                    <ul>
                        {templates.map(t => (
                            <li key={t.id}>
                                <strong>{t.template_type}</strong>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="card">
                    <h3>Student Requests</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Certificate Type</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(r => (
                                <tr key={r.id}>
                                    <td>{r.student_name || 'N/A'}</td>
                                    <td>{r.template_type}</td>
                                    <td>{new Date(r.request_date).toLocaleDateString()}</td>
                                    <td><span className={`status ${r.status.toLowerCase()}`}>{r.status}</span></td>
                                    <td>
                                        {r.status === 'Pending' && (
                                            <>
                                                <button onClick={() => handleRequest(r.id, 'Approved')}>Approve</button>
                                                <button onClick={() => handleRequest(r.id, 'Rejected')} className="reject">Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div >
    );
}

function StudentDashboard({ user, onLogout }) {
    const [templates, setTemplates] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [selectedType, setSelectedType] = useState('All');
    const [downloading, setDownloading] = useState(false);
    const [certData, setCertData] = useState(null);
    const certRef = useRef(null);

    useEffect(() => {
        fetchTemplates();
        fetchRequests();
    }, []);

    const fetchTemplates = async () => {
        const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/student/templates', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) setTemplates(await res.json());
    };

    const fetchRequests = async () => {
        const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/student/requests', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) setMyRequests(await res.json());
    };

    const requestCertificate = async (templateId) => {
        const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/student/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ template_id: templateId })
        });
        if (res.ok) {
            fetchRequests();
            alert('Request submitted!');
        }
    };

    const handleDownload = async (requestId) => {
        setDownloading(true);
        try {
            // Fetch certificate data
            const res = await fetch(`https://certichain-backend-x2zk.onrender.com/api/student/certificate/${requestId}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch certificate data');
            const data = await res.json();

            console.log('Certificate data received:', data); // Debug log

            // Fallback for student_name if null (use username)
            if (!data.student_name && data.student_username) {
                data.student_name = data.student_username;
            }
            if (!data.institute_name && data.institute_username) {
                data.institute_name = data.institute_username;
            }

            // Generate QR Code using backend API
            let qrCodeUrl = '';
            if (data.certificate_hash) {
                try {
                    const qrRes = await fetch(`https://certichain-backend-x2zk.onrender.com/api/qrcode/${data.certificate_hash}`, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    if (qrRes.ok) {
                        const qrData = await qrRes.json();
                        qrCodeUrl = qrData.qrCodeDataUrl;
                    } else {
                        console.warn('Failed to generate QR code, using placeholder');
                        qrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                    }
                } catch (e) {
                    console.error('QR code generation error:', e);
                    qrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                }
            } else {
                console.warn('No certificate hash available');
                qrCodeUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
            }

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
            const templateRes = await fetch(`https://certichain-backend-x2zk.onrender.com/templates/${filename}`);
            let htmlContent = await templateRes.text();

            // Fetch and inline CSS
            const cssRes = await fetch('https://certichain-backend-x2zk.onrender.com/templates/styles.css');
            const cssContent = await cssRes.text();
            htmlContent = htmlContent.replace('<link rel="stylesheet" href="styles.css">', `<style>${cssContent}</style>`);

            // Replace all placeholders with actual data
            const replacePlaceholders = (html, data, qrCode) => {
                let result = html;

                // Replace all data fields
                Object.keys(data).forEach(key => {
                    const placeholder = `{{${key}}}`;
                    const value = data[key] || '';
                    // Use regex with global flag to replace all occurrences
                    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
                });

                // Replace QR code
                result = result.replace(/\{\{qrCode\}\}/g, qrCode);

                // Replace certificate ID and transaction ID (using request ID as fallback)
                result = result.replace(/\{\{certificateId\}\}/g, data.certificate_hash || requestId);
                result = result.replace(/\{\{transactionId\}\}/g, data.certificate_hash || 'N/A');

                return result;
            };

            htmlContent = replacePlaceholders(htmlContent, data, qrCodeUrl);

            const container = document.createElement('div');
            container.innerHTML = htmlContent;
            document.body.appendChild(container);

            // Find the certificate element
            const certificateElement = container.querySelector('#certificate');

            // Wait for images to load
            const images = certificateElement.querySelectorAll('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            // Generate PDF
            const canvas = await html2canvas(certificateElement, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${data.template_type.replace(/ /g, '_')}_${requestId}.pdf`);

            // Cleanup
            document.body.removeChild(container);
            setDownloading(false);

        } catch (e) {
            console.error(e);
            alert('Download failed: ' + e.message);
            setDownloading(false);
        }
    };

    // Filter to show only unique certificate types
    const uniqueTemplates = Array.from(
        new Map(templates.map(t => [t.template_type, t])).values()
    );

    const filteredTemplates = selectedType === 'All'
        ? uniqueTemplates
        : uniqueTemplates.filter(t => t.template_type === selectedType);

    const CertificateComponent = certData ? CertificateTemplates[certData.template_type] : null;

    return (
        <div className="dashboard">
            <header>
                <h1>Student Dashboard</h1>
                <div className="user-info">
                    <Link to="/student/documents" className="btn-secondary" style={{ marginRight: '10px' }}>My Documents</Link>
                    <span>{user.name}</span>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </header>

            <div className="content">
                <section className="card">
                    <h3>Available Certificates</h3>
                    <div className="filters">
                        <label>Filter by Type: </label>
                        <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                            <option value="All">All</option>
                            {CertificateTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Certificate Name</th>
                                <th>Institute</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTemplates.length > 0 ? (
                                filteredTemplates.map(t => (
                                    <tr key={t.id}>
                                        <td>{t.template_type}</td>
                                        <td>{t.institute_name}</td>
                                        <td>
                                            <button onClick={() => requestCertificate(t.id)}>Request</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No templates available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                <section className="card">
                    <h3>My Requests</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Institute</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myRequests.length > 0 ? (
                                myRequests.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.template_type}</td>
                                        <td>{r.institute_name}</td>
                                        <td><span className={`status ${r.status.toLowerCase()}`}>{r.status}</span></td>
                                        <td>
                                            {r.status === 'Approved' && (
                                                <button className="download" onClick={() => handleDownload(r.id)} disabled={downloading}>
                                                    {downloading ? 'Generating...' : 'Download'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No requests yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </div >

            {/* Hidden Certificate Render Container */}
            {
                certData && CertificateComponent && (
                    <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                        <div ref={certRef}>
                            <CertificateComponent data={certData} />
                        </div>
                    </div>
                )
            }
        </div >
    );
}

// --- Verification Page ---

function VerificationPage() {
    const { hash } = useParams();
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`https://certichain-backend-x2zk.onrender.com/api/verify/${hash}`);
                const data = await res.json();
                setVerificationResult(data);
            } catch (e) {
                setVerificationResult({ valid: false, error: 'Network error' });
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [hash]);

    if (loading) return <div className="verification-container"><h2>Verifying...</h2></div>;

    return (
        <div className="verification-container">
            <div className={`verification-card ${verificationResult.valid ? 'valid' : 'invalid'}`}>
                {verificationResult.valid ? (
                    <>
                        <div className="icon">✅</div>
                        <h2>Certificate Verified</h2>
                        <p className="hash">Hash: {hash}</p>
                        <div className="details">
                            <p><strong>Student:</strong> {verificationResult.data.student_name}</p>
                            <p><strong>Institute:</strong> {verificationResult.data.institute_name}</p>
                            <p><strong>Certificate:</strong> {verificationResult.data.template_name}</p>
                            <p><strong>Type:</strong> {verificationResult.data.template_type}</p>
                            <p><strong>Issued On:</strong> {new Date(verificationResult.data.request_date).toLocaleDateString()}</p>
                        </div>
                        <div className="blockchain-info">
                            <h4>Blockchain Record</h4>
                            <p><strong>Block Hash:</strong> {verificationResult.block.hash}</p>
                            <p><strong>Previous Hash:</strong> {verificationResult.block.previousHash}</p>
                            <p><strong>Timestamp:</strong> {new Date(verificationResult.block.timestamp).toLocaleString()}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="icon">❌</div>
                        <h2>Verification Failed</h2>
                        <p>{verificationResult.error}</p>
                    </>
                )}
                <Link to="/" className="btn-primary">Back to Home</Link>
            </div>
        </div>
    );
}

// --- Forgot Password Page ---

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        setPreviewUrl('');

        try {
            const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                if (data.previewUrl) {
                    setPreviewUrl(data.previewUrl);
                }
                setEmail('');
            } else {
                setError(data.error || 'Failed to send reset email');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Forgot Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>

            {error && <p className="error">{error}</p>}
            {message && (
                <div className="success-message">
                    <p>{message}</p>
                    {previewUrl && (
                        <p style={{ marginTop: '10px', fontSize: '0.9em' }}>
                            <strong>Development Mode:</strong>{' '}
                            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                                View test email
                            </a>
                        </p>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <p><Link to="/login/student">Back to Student Login</Link></p>
            <p><Link to="/login/institute">Back to Institute Login</Link></p>
            <p><Link to="/">Back to Home</Link></p>
        </div>
    );
}

// --- Reset Password Page ---

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await fetch(`https://certichain-backend-x2zk.onrender.com/api/auth/verify-reset-token/${token}`);
                const data = await res.json();

                if (data.valid) {
                    setTokenValid(true);
                    setEmail(data.email);
                } else {
                    setError(data.error || 'Invalid or expired reset link');
                }
            } catch (err) {
                setError('Failed to verify reset link');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login/student');
                }, 3000);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="auth-container">
                <h2>Verifying...</h2>
                <p>Please wait while we verify your reset link.</p>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="auth-container">
                <h2>Invalid Reset Link</h2>
                <p className="error">{error}</p>
                <p>The reset link may have expired or is invalid.</p>
                <p><Link to="/forgot-password">Request a new reset link</Link></p>
                <p><Link to="/">Back to Home</Link></p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="auth-container">
                <h2>Password Reset Successful!</h2>
                <div className="success-message">
                    <p>✅ Your password has been reset successfully.</p>
                    <p>Redirecting to login page...</p>
                </div>
                <p><Link to="/login/student">Go to Login</Link></p>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            <p>Enter your new password for <strong>{email}</strong></p>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>

            <p><Link to="/login/student">Back to Login</Link></p>
        </div>
    );
}

function App() {
    const [user, setUser] = useState(null);

    // Load user from localStorage on app initialization
    useEffect(() => {
        const savedUser = localStorage.getItem('certichain_user');
        console.log('Loading saved user from localStorage:', savedUser); // DEBUG
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                console.log('Parsed user data:', parsedUser); // DEBUG
                console.log('User role from localStorage:', parsedUser.role); // DEBUG
                setUser(parsedUser);
            } catch (e) {
                console.error('Failed to parse saved user data:', e);
                localStorage.removeItem('certichain_user');
            }
        }
    }, []);

    const handleLogin = (userData) => {
        console.log('=== HANDLE LOGIN DEBUG START ===');
        console.log('1. handleLogin called with:', JSON.stringify(userData, null, 2));
        console.log('2. User role:', userData.role);
        console.log('3. Setting user state...');
        setUser(userData);

        // Save user data to localStorage
        const jsonString = JSON.stringify(userData);
        console.log('4. JSON string to save:', jsonString);
        localStorage.setItem('certichain_user', jsonString);

        const savedData = localStorage.getItem('certichain_user');
        console.log('5. Saved to localStorage:', savedData);
        console.log('6. Parsed back:', JSON.parse(savedData));
        console.log('=== HANDLE LOGIN DEBUG END ===');
    };

    const handleLogout = () => {
        setUser(null);
        // Clear user data from localStorage
        localStorage.removeItem('certichain_user');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/student" element={!user ? <Login onLogin={handleLogin} expectedRole="student" /> : <Navigate to="/student" />} />
                <Route path="/login/institute" element={!user ? <Login onLogin={handleLogin} expectedRole="institute" /> : <Navigate to="/institute" />} />
                <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'institute' ? '/institute' : '/student'} />} />
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to={user.role === 'institute' ? '/institute' : '/student'} />} />
                <Route path="/signup/institute" element={!user ? <InstituteSignup /> : <Navigate to={user.role === 'institute' ? '/institute' : '/student'} />} />
                <Route
                    path="/institute"
                    element={user && user.role === 'institute' ? <InstituteDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login/institute" />}
                />
                <Route
                    path="/institute/analytics"
                    element={user && user.role === 'institute' ? <InstituteAnalytics user={user} onLogout={handleLogout} /> : <Navigate to="/login/institute" />}
                />
                <Route
                    path="/student"
                    element={user && user.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login/student" />}
                />
                <Route
                    path="/student/documents"
                    element={user && user.role === 'student' ? <StudentDocuments user={user} onLogout={handleLogout} /> : <Navigate to="/login/student" />}
                />
                <Route path="/verify/:hash" element={<VerificationPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
