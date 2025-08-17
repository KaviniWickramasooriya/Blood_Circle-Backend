const express = require('express');
const cors = require('cors');
//const { Sequelize } = require('sequelize');
const db = require('./src/config/db');

const bloodRoutes = require('./src/routes/bloodRoutes');
const bloodRequestRoutes = require('./src/routes/bloodRequestRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(cors());


app.use('/api/blood', bloodRoutes);
app.use('/api/blood/blood-requests', bloodRequestRoutes);

// Initialize database and start server
/*(async () => {
  try {
    // await db.authenticate();
    // console.log('✅ Database connected');

    // await db.sync();
    // console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`🚀 Blood Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
    process.exit(1);
  }
})();*/
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    // Sync models with the database
    return sequelize.sync({ force: false }); // Set to true only for development to drop and recreate tables
  })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Database connection or sync error:', err);
    process.exit(1); // Exit if connection or sync fails
  });


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors.map(e => e.message) });
  }
  res.status(500).json({ error: 'Something went wrong!' });
});
