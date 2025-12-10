import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function InstituteAnalytics({ user, onLogout }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('https://certichain-backend-x2zk.onrender.com/api/institute/analytics', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            } else {
                console.error('Failed to fetch analytics');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="dashboard">Loading analytics...</div>;
    if (!analytics) return <div className="dashboard">Failed to load analytics.</div>;

    // Calculate max value for bar chart scaling
    const maxCount = analytics.popularCertificates.length > 0
        ? Math.max(...analytics.popularCertificates.map(c => c.count))
        : 10;

    return (
        <div className="dashboard">
            <header>
                <h1>Institute Analytics</h1>
                <div className="user-info">
                    <Link to="/institute" className="btn-secondary" style={{ marginRight: '10px' }}>Dashboard</Link>
                    <span>{user.name}</span>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </header>

            <div className="content">
                {/* Metric Cards */}
                <div className="analytics-grid">
                    <div className="card metric-card">
                        <h3>Total Issued</h3>
                        <div className="metric-value">{analytics.totalIssued}</div>
                        <div className="metric-label">Certificates</div>
                    </div>
                    <div className="card metric-card">
                        <h3>Pending Requests</h3>
                        <div className="metric-value">{analytics.totalPending}</div>
                        <div className="metric-label">Requests</div>
                    </div>
                    <div className="card metric-card">
                        <h3>Total Downloads</h3>
                        <div className="metric-value">{analytics.totalDownloads}</div>
                        <div className="metric-label">Downloads</div>
                    </div>
                    <div className="card metric-card">
                        <h3>Verification Rate</h3>
                        <div className="metric-value">{analytics.verificationRate}%</div>
                        <div className="metric-label">Success Rate</div>
                    </div>
                </div>

                {/* Charts Section */}
                <section className="card">
                    <h3>Popular Certificate Types</h3>
                    <div className="chart-container">
                        {analytics.popularCertificates.length > 0 ? (
                            analytics.popularCertificates.map((item, index) => (
                                <div key={index} className="bar-row">
                                    <span className="bar-label">{item.template_type}</span>
                                    <div className="bar-track">
                                        <div
                                            className="bar-fill"
                                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                                        >
                                            <span className="bar-value">{item.count}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No data available yet.</p>
                        )}
                    </div>
                </section>
            </div>

            <style>{`
                .analytics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .metric-card {
                    text-align: center;
                    padding: 20px;
                }
                .metric-value {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 10px 0;
                }
                .metric-label {
                    color: #7f8c8d;
                }
                .chart-container {
                    margin-top: 20px;
                }
                .bar-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .bar-label {
                    width: 200px;
                    text-align: right;
                    padding-right: 15px;
                    font-weight: 500;
                }
                .bar-track {
                    flex-grow: 1;
                    background-color: #ecf0f1;
                    border-radius: 4px;
                    height: 24px;
                    overflow: hidden;
                }
                .bar-fill {
                    background-color: #3498db;
                    height: 100%;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 8px;
                    color: white;
                    font-size: 0.9em;
                    transition: width 0.5s ease-in-out;
                    min-width: 30px; /* Ensure value is visible */
                }
                .bar-value {
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
}

export default InstituteAnalytics;
