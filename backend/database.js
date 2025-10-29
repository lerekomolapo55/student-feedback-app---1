let feedbackData = [];

function getNextId() {
  return feedbackData.length > 0 ? Math.max(...feedbackData.map(f => f.id)) + 1 : 1;
}

const db = {
  all: (query, params, callback) => {
    // Simulate SELECT * FROM feedback ORDER BY createdAt DESC
    const data = [...feedbackData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(null, data);
  },
  run: (query, params, callback) => {
    // Simulate INSERT or DELETE
    if (query.includes('INSERT')) {
      const [studentName, courseCode, comments, rating] = params;
      const newFeedback = {
        id: getNextId(),
        studentName,
        courseCode,
        comments,
        rating,
        createdAt: new Date().toISOString()
      };
      feedbackData.push(newFeedback);
      callback.call({ lastID: newFeedback.id }, null);
    } else if (query.includes('DELETE')) {
      const [id] = params;
      const index = feedbackData.findIndex(f => f.id == id);
      if (index > -1) {
        feedbackData.splice(index, 1);
        callback.call({ changes: 1 }, null);
      } else {
        callback.call({ changes: 0 }, null);
      }
    }
  },
  get: (query, params, callback) => {
    // Simulate stats query
    const totalFeedback = feedbackData.length;
    const averageRating = totalFeedback > 0 ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback : 0;
    const totalCourses = new Set(feedbackData.map(f => f.courseCode)).size;
    callback(null, { totalFeedback, averageRating, totalCourses });
  }
};

console.log('Using in-memory database.');

module.exports = db;
