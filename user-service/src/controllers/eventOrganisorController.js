const { EventOrganiser } = require('../config/db').models;

exports.createEventOrganiser = async (req, res) => {
  try {
    const organiser = await EventOrganiser.create(req.body);
    res.status(201).json(organiser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};