import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    totalCourses: 0,
    recentFeedback: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      setStats(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Feedback History</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalFeedback}</div>
          <div className="stat-label">Total Feedback</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.averageRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.totalCourses}</div>
          <div className="stat-label">Courses Rated</div>
        </div>
      </div>

      <div className="recent-feedback">
        <h3>Recent Feedback</h3>
        {stats.recentFeedback.length === 0 ? (
          <p>No recent feedback</p>
        ) : (
          <div className="recent-list">
            {stats.recentFeedback.map((item, index) => (
              <div key={index} className="recent-item">
                <div className="recent-header">
                  <span className="recent-course">{item.courseCode}</span>
                  <span className="recent-rating">Rating: {item.rating}/5</span>
                </div>
                <div className="recent-student">By: {item.studentName}</div>
                <div className="recent-comments">{item.comments}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;