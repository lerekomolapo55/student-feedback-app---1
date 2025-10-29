import React, { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [refreshList, setRefreshList] = useState(false);

  const handleFeedbackAdded = () => {
    setRefreshList(prev => !prev);
  };

  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>Student Feedback System</h1>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-btn ${activeTab === 'welcome' ? 'active' : ''}`}
            onClick={() => setActiveTab('welcome')}
          >
            Home
          </button>
          <button 
            className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Submit Feedback
          </button>
          <button 
            className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            View Feedback
          </button>
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            History
          </button>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {activeTab === 'welcome' && <Welcome />}
          {activeTab === 'form' && (
            <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
          )}
          {activeTab === 'list' && (
            <FeedbackList refresh={refreshList} />
          )}
          {activeTab === 'dashboard' && (
            <Dashboard />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Student Feedback App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;