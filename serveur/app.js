const express = require('express');
const api = require('./api.js');
const { MongoClient, connectionDB } = require('./db.js')
const cors = require('cors');

const app = express();
const db = connectionDB();

// Middleware
app.use(express.json());

//Cors middleware 
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], 
  credentials: true // cookies ?? 
}));


// Routage
app.use('/api', api.default(db));

// Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);

  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    res.status(err.status || 500).send('Internal Server Error');
  }
});

// Fermeture de MongoDB
// process.on('SIGINT', async () => {
//   await client.close();
//   console.log('MongoDB connection closed');
//   process.exit(0);
// });

module.exports = app;