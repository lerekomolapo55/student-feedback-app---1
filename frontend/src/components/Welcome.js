import React from 'react';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Student Feedback Portal</h1>
        
        <div className="welcome-section">
          <h2>About This Application</h2>
          <p>
            The Student Feedback Portal is designed to help students share their experiences 
            and provide valuable feedback about their courses. This platform enables:
          </p>
          <ul>
            <li>Submitting detailed course feedback with ratings</li>
            <li>Viewing feedback from other students</li>
            <li>Tracking overall course performance through analytics</li>
            <li>Helping educators improve course quality</li>
          </ul>
        </div>

        <div className="welcome-section">
          <h2>How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Submit Feedback</h3>
              <p>Share your course experiences by providing ratings and comments to help improve educational quality.</p>
            </div>
            <div className="feature-card">
              <h3>View Feedback</h3>
              <p>See what other students are saying about various courses to make informed decisions.</p>
            </div>
            <div className="feature-card">
              <h3>Dashboard History</h3>
              <p>Access comprehensive statistics and insights about course feedback and ratings.</p>
            </div>
          </div>
        </div>

        <div className="welcome-section">
          <h2>Getting Started</h2>
          <p>
            Navigate to the Portal using the navigation bar above to start submitting and viewing 
            course feedback. Your input helps create a better learning environment for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;