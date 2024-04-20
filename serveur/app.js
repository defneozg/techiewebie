const express = require('express');
const api = require('./api.js');
const { MongoClient } = require('mongodb');
var db = {};

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB (asynchronous)
(async () => {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    console.log('Connected to MongoDB');

    // Use the client for database operations (if needed)
    db = client.db('Projet_Christine_Defne'); // Replace with your database name

    // Start the server after successful connection
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application on error
  }
})();

// Route Mounting
app.use('/api', api.default(db));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  // Provide a more informative error message in development
  if (process.env.NODE_ENV === 'development') {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    res.status(err.status || 500).send('Internal Server Error');
  }
});

// Close MongoDB connection on application exit (optional)
// process.on('SIGINT', async () => {
//   await client.close();
//   console.log('MongoDB connection closed');
//   process.exit(0);
// });

module.exports = app;