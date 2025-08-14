const { Donor } = require('../config/db').models;

exports.createDonor = async (req, res) => {
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json(donor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};