
const { Blood } = require('../config/db').models;
//const bcrypt = require('bcrypt');

exports.createBlood = async (req, res) => {
  try {
    const blood = await Blood.create(req.body);
    res.status(201).json(blood);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};
exports.getAllBloodRecords = async (req, res) => {
  try {
    const bloodRecords = await Blood.findAll(); // Sequelize → findAll(), not find()
    res.json(bloodRecords);
  } catch (err) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};
exports.addBloodQuantity = async (req, res) => {
  const { id } = req.params; // blood ID
  const { quantity } = req.body; // amount to add

  try {
    const blood = await Blood.findByPk(id);
    if (!blood) return res.status(404).json({ message: 'Blood type not found' });

    // Increment quantity
    await blood.increment('quantity', { by: quantity });

    // Refresh the instance to get updated value
    await blood.reload();

    res.json({
      message: `Added ${quantity} units to blood type ${blood.type}`,
      blood
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
