
const { Blood } = require('../config/db').models;
const bcrypt = require('bcrypt');

exports.createBlood = async (req, res) => {
  try {
    const blood = await Blood.create(req.body);
    res.status(201).json(blood);
  } catch (error) {
    next(error);
  }
};
// Get single blood record by ID
exports.getBloodRecordById = async (req, res) => {
  try {
    const bloodRecord = await Blood.findByPk(req.params.id);

    if (!bloodRecord) {
      return res.status(404).json({ message: 'Blood record not found' });
    }
    res.json(bloodRecord);
  } catch (err) {
    next(error);
  }
};
exports.getAllBloodRecords = async (req, res) => {
  try {
    const bloodRecords = await Blood.findAll(); // Sequelize → findAll(), not find()
    res.json(bloodRecords);
  } catch (err) {
    next(error);
  }
};
// Update blood record
exports.updateBloodRecord = async (req, res) => {
  try {
    const bloodRecord = await Blood.findByPk(req.params.id);
    if (!bloodRecord) return res.status(404).json({ message: 'Not found' });

    await bloodRecord.update(req.body);
    res.json(bloodRecord);
  } catch (err) {
    next(error);
  }
};

// Delete blood record
exports.deleteBloodRecord = async (req, res) => {
  try {
    const bloodRecord = await Blood.findByPk(req.params.id);
    if (!bloodRecord) return res.status(404).json({ message: 'Not found' });

    await bloodRecord.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(error);
  }
};

