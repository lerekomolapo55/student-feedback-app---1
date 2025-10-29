import React, { useState } from 'react';
import { feedbackAPI } from '../services/api';

const FeedbackForm = ({ onFeedbackAdded }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    courseCode: '',
    comments: '',
    rating: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }

    if (!formData.comments.trim()) {
      newErrors.comments = 'Comments are required';
    } else if (formData.comments.trim().length < 2) {
      newErrors.comments = 'Comments must be at least 2 characters long';
    }

    if (!formData.rating) {
      newErrors.rating = 'Rating is required';
    } else if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const response = await feedbackAPI.create({
        ...formData,
        rating: parseInt(formData.rating)
      });

      setSuccessMessage('Feedback submitted successfully!');
      setFormData({
        studentName: '',
        courseCode: '',
        comments: '',
        rating: ''
      });
      
      if (onFeedbackAdded) {
        onFeedbackAdded();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({ submit: error.response?.data?.error || 'Failed to submit feedback' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div className="feedback-form-container">
      <h2>Submit Course Feedback</h2>
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="studentName">Student Name *</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={errors.studentName ? 'error' : ''}
          />
          {errors.studentName && <span className="error-text">{errors.studentName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="courseCode">Course Code *</label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="e.g., CS101, MATH202"
            className={errors.courseCode ? 'error' : ''}
          />
          {errors.courseCode && <span className="error-text">{errors.courseCode}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments *</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Share your thoughts about the course..."
            rows="4"
            className={errors.comments ? 'error' : ''}
          />
          {errors.comments && <span className="error-text">{errors.comments}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating *</label>
          <div className="rating-options">
            {ratingOptions.map(number => (
              <label key={number} className="rating-option">
                <input
                  type="radio"
                  name="rating"
                  value={number}
                  checked={formData.rating === number.toString()}
                  onChange={handleChange}
                />
                <span className="rating-number">{number}</span>
              </label>
            ))}
          </div>
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>

        {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;