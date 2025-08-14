require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db.js');

const roleRoutes = require("./src/routes/roleRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const donorRoutes = require("./src/routes/donorRoutes");
const eventOrganisorRoutes = require("./src/routes/eventOrganisorRoutes");
const genderRoutes = require("./src/routes/genderRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Verify Database Connection
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// Routes
app.use("/api/users/donor", donorRoutes);
app.use("/api/users/eventOrganisor", eventOrganisorRoutes);
app.use("/api/users/gender", genderRoutes);
app.use("/api/users/roles", roleRoutes);
app.use("/api/users/admin", adminRoutes);

// 404 Error Handler
app.use((req, res) => {
  console.log(`404 Error - Requested URL: ${req.originalUrl}`);
  res.status(404).send('Not Found');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`${process.env.SERVICE_NAME} Service running on port ${PORT}`));