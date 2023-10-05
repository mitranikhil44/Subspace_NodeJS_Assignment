// Import the Express application from app.js
const app = require('./app');

// Define the port for the Express server
const port = process.env.PORT || 3000;

// Start the Express server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
