const express = require('express');
const router = express.Router();
const { Event } = require('../config/db').models;

router.post('/', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;