const express = require('express');

const sequelize = require('./src/config/db.js');
const cors = require('cors');

const bloodRoutes = require('./routes/bloodRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const db = require('./config/db');

const app = express();


//Middleware
app.use(express.json());
app.use(cors());


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

// Routes
app.use('/api/blood', bloodRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);

//Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
// Start Server
const PORT = process.env.PORT || 3003;