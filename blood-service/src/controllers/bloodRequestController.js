const { BloodRequest } = require('../config/db').models;

// Create new blood request
exports.createBloodRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.create(req.body);
    res.status(201).json(bloodRequest);
  } catch (error) {
    next(error);  // passes error to middleware
  }
};

// Get all blood requests
exports.getAllBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.findAll({
      include: { association: 'blood' } // ✅ joins Blood table
    });
    res.json(requests);
  } catch (error) {
    next(error);  // passes error to middleware
  }
};

// Get single blood request by ID
exports.getBloodRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id, {
      include: { association: 'blood' }
    });
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    res.json(request);
  } catch (error) {
    next(error);  // passes error to middleware
   
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
    next(error);  // passes error to middleware
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
    next(error);  // passes error to middleware
  }
};

/*const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const offset = (page - 1) * limit;

const requests = await BloodRequest.findAndCountAll({ limit, offset });
res.json({
  data: requests.rows,
  total: requests.count,
  page,
  totalPages: Math.ceil(requests.count / limit)
});
*/