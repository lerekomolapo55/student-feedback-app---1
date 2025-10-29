import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../services/api';

const FeedbackList = ({ refresh }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, [refresh]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAll();
      setFeedback(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await feedbackAPI.delete(id);
      setFeedback(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    }
  };

  if (loading) {
    return <div className="loading">Loading feedback...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="feedback-list-container">
      <h2>Course Feedback ({feedback.length})</h2>
      
      {feedback.length === 0 ? (
        <div className="no-feedback">
          No feedback submitted yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="feedback-grid">
          {feedback.map((item) => (
            <div key={item.id} className="feedback-card">
              <div className="feedback-header">
                <h3 className="course-code">{item.courseCode}</h3>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="delete-btn"
                  title="Delete feedback"
                >
                  Delete
                </button>
              </div>
              
              <div className="student-info">
                <strong>By: {item.studentName}</strong>
              </div>
              
              <div className="rating">
                Rating: {item.rating}/5
              </div>
              
              <div className="comments">
                {item.comments}
              </div>
              
              <div className="feedback-date">
                Submitted: {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;