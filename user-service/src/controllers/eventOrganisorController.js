const { EventOrganiser, Role } = require('../config/db').models;

exports.createEventOrganiser = async (req, res) => {
  try {
    const { name, email, password, nic, address, telephoneNo } = req.body;

    // Input validation
    if (!name || !email || !password || !nic || !address || !telephoneNo) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          name: name ? undefined : 'Name is required',
          email: email ? undefined : 'Email is required',
          password: password ? undefined : 'Password is required',
          nic: nic ? undefined : 'NIC is required',
          address: address ? undefined : 'Address is required',
          telephoneNo: telephoneNo ? undefined : 'Mobile is required',
        }
      });
    }

    // Additional email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Fetch the roleId for "Organisor" from the Roles table
    const organisorRole = await Role.findOne({ where: { name: 'Organisor' } });
    if (!organisorRole) {
      return res.status(400).json({
        error: 'Role "Organisor" not found',
        details: 'Please ensure the "Organisor" role exists in the Roles table'
      });
    }
    const roleId = organisorRole.id;

    // Create EventOrganiser with the automatically assigned roleId
    const eventOrganiser = await EventOrganiser.create({
      name,
      email,
      password,
      nic,
      address,
      telephoneNo,
      roleId,
    });

    // Prepare response (exclude password and include roleId)
    const eventOrganiserResponse = {
      id: eventOrganiser.id,
      name: eventOrganiser.name,
      email: eventOrganiser.email,
      nic: eventOrganiser.nic,
      address: eventOrganiser.address,
      telephoneNo: eventOrganiser.telephoneNo,
      roleId: eventOrganiser.roleId, // Include the automatically assigned roleId
    };

    return res.status(201).json({
      message: 'Event Organiser Created Successfully',
      data: eventOrganiserResponse
    });

  } catch (error) {
    // Handle specific Sequelize errors
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Duplicate entry',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    // Handle foreign key constraint errors (e.g., invalid roleId)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: 'Foreign key constraint failed',
        details: {
          field: 'roleId',
          message: 'The specified role does not exist'
        }
      });
    }

    // Handle password hashing errors
    if (error.message === 'Error hashing password') {
      return res.status(500).json({
        error: 'Internal server error',
        details: 'Failed to process password'
      });
    }

    // Handle unexpected errors
    console.error('Error creating Event Organiser:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred while creating the Event Organiser'
    });
  }
};