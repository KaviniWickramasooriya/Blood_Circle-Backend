const express = require('express');
const { Sequelize } = require('sequelize');
const routes = require('./routes');
const db = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`User Service: ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', req.body);
  next();
});

app.use('/api/users', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'User Service', status: 'running', port: PORT });
});

// 404 handler for user service
app.use('*', (req, res) => {
  console.log(`User Service 404: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'User service route not found', path: req.url });
});

// Initialize database and start server
(async () => {
  try {
    await db.authenticate();
    console.log('Database connected');
    await db.sync();
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();