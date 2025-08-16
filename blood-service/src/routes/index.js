/*const express = require('express');
const router = express.Router();
const { Blood, BloodRequest } = require('../config/db').models;

router.post('/', async (req, res) => {
  try {
    const blood = await Blood.create(req.body);
    res.status(201).json(blood);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
*/