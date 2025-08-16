const express = require('express');


const { sequelize } = require('./config/db');
const cors = require('cors');

const bloodRoutes = require('./routes/bloodRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const db = require('./config/db');

const app = express();
// Start Server
const PORT = process.env.PORT || 3003;

// Routes
app.use('/api/blood', bloodRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
//Middleware
app.use(express.json());
app.use(cors());

// Initialize database and start server
(async () => {
  try {
    await db.authenticate();
    console.log('Database connected');
    await db.sync();
    app.listen(PORT, () => {
      console.log(`Blood Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();



//Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors.map(e => e.message) });
  }
  res.status(500).json({ error: 'Something went wrong!' });
});
