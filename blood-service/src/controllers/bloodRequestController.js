const { BloodRequest } = require('../config/db').models;

// Create new blood request
exports.createBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.create(req.body);
    res.status(201).json(bloodRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all blood requests
exports.getAllBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.findAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single blood request by ID
exports.getBloodRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update blood request
exports.updateBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    await request.update(req.body);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete blood request
exports.deleteBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    await request.destroy();
    res.json({ message: 'Blood request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
