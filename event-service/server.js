const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors'); // Add CORS for microservices communication
const helmet = require('helmet'); // Security
const rateLimit = require('express-rate-limit'); // Rate limiting
const sequelize = require('./src/config/db.js');
const eventRoutes = require('./src/routes/eventRoutes.js'); // Updated to specific routes file

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: '*' })); // Adjust for production
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/events', eventRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Event Service' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Initialize database and start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected to blood_circle_db_event_service');
    const Event = require('./src/models/Event.js')(sequelize);
    await sequelize.sync({ alter: true }); // Corrected to use alter: true for safe schema updates
    console.log('Database synced');
    
    app.listen(PORT, () => {
      console.log(`Event Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();

module.exports = app;