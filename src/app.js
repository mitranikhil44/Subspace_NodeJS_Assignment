// Import required dependencies and modules
const express = require('express');
const app = express();
const _ = require('lodash');

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for handling Cross-Origin Resource Sharing (CORS)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log(`Received a ${req.method} request at ${req.url}`);
  next();
});

// Import and use routes for Blog Analytics and Blog Search
const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blog-stats', blogRoutes);
const searchRoutes = require('./routes/searchRoutes');
app.use('/api/blog-search', searchRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
