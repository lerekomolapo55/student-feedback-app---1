# Deployment Plan for Student Feedback App

## Backend Deployment to Render
- [x] Update backend/package.json: Replace sqlite3 with pg dependency
- [x] Update backend/database.js: Migrate to PostgreSQL client
- [x] Update backend/server.js: Adjust queries for PostgreSQL syntax if needed
- [ ] Deploy backend to Render with PostgreSQL database
- [ ] Test backend endpoints on Render

## Frontend Deployment to GitHub Pages
- [ ] Update frontend/package.json: Add gh-pages dependency and deploy script
- [ ] Update frontend/src/services/api.js: Change API_BASE_URL to deployed backend URL
- [ ] Build and deploy frontend to GitHub Pages on "student-feedback-app---1" repo
- [ ] Test frontend integration with backend API

## Final Testing
- [ ] Ensure application runs without errors
- [ ] Verify backend API endpoints work correctly from frontend
