const express = require('express');
const { Sequelize } = require('sequelize');
const routes = require('./routes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/users', routes);

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