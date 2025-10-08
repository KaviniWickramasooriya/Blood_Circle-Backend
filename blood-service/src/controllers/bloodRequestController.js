const { BloodRequest,Blood } = require('../config/db').models;

// Create new blood request
exports.createBloodRequest = async (req, res) => {
  const { blood_id, quantity, name, contactNumber, email } = req.body;

  try {
    // 1. Check if blood type exists
    const blood = await Blood.findByPk(blood_id);
    if (!blood) {
      return res.status(404).json({ error: 'Blood type not found' });
    }

    // 2. Check stock availability
    if (blood.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough blood units available' });
    }

    // 3. Create blood request
    const bloodRequest = await BloodRequest.create({
      blood_id,
      quantity,
      name,
      contactNumber,
      email
    });

    // 4. Deduct stock
    blood.quantity -= quantity;
    await blood.save();

    res.status(201).json({
      message: 'Blood request created successfully',
      request: bloodRequest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: error.message });
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
// Update blood request status (Admin only)
exports.updateBloodRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'pending', 'approved', 'declined'

  try {
    // Validate status value
    if (!['pending', 'approved', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Find request
    const request = await BloodRequest.findByPk(id, { include: { association: 'blood' } });
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    // If admin approves → reduce blood stock
    if (status === 'approved') {
      const blood = request.blood;
      if (blood.quantity < request.quantity) {
        return res.status(400).json({ error: 'Not enough stock to approve this request' });
      }
      blood.quantity -= request.quantity;
      await blood.save();
    }

    // If admin declines → no stock change, just update status
    request.status = status;
    await request.save();

    res.json({
      message: `Blood request ${status} successfully.`,
      request
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
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