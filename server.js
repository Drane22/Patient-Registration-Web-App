require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
// Initialize Express
const app = express();

// Initialize database and models
let db;

// Function to initialize database
async function initDB() {
  try {
    db = await require('./models');
    return db;
  } catch (err) {
    console.error('Failed to initialize database:', err);
    throw err;
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/checkin', require('./routes/checkin'));

// Serve static assets
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server and initialize database
async function startServer() {
  try {
    // Initialize database
    db = await initDB();
    const { sequelize } = await db;
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    
    // Start server only after database is ready
    const server = app.listen(PORT)
      .on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use. Please try the following:
          1. Check if another instance of the server is running
          2. Stop any process using port ${PORT}
          3. Set a different PORT in your .env file`);
        } else {
          console.error('Server startup error:', error);
        }
        process.exit(1);
      })
      .on('listening', () => {
        console.log(`Server running on port ${PORT}`);
      });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        sequelize.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        sequelize.close();
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Server startup error:', err);
    if (err.original) {
      console.error('Database error details:', err.original);
    }
    console.error('Please check if MySQL is running and credentials are correct');
    process.exit(1);
  }
}

// Initialize server
startServer();