const express = require('express');
const bloodRoutes = require('./routes/bloodRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/api/blood', bloodRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

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
