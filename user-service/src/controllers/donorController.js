const { Donor, Role } = require('../config/db').models;
const bcrypt = require('bcrypt');

exports.registerDonor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      bloodType,
      dateOfBirth,
      nic,
      address,
      genderId,
      telephoneNo
    } = req.body;

    // Input validation (removed roleId from required fields)
    if (!name || !email || !password || !bloodType || !dateOfBirth || !nic || !address || !genderId || !telephoneNo) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          name: name ? undefined : 'Name is required',
          email: email ? undefined : 'Email is required',
          password: password ? undefined : 'Password is required',
          bloodType: bloodType ? undefined : 'Blood type is required',
          dateOfBirth: dateOfBirth ? undefined : 'Date of birth is required',
          nic: nic ? undefined : 'NIC is required',
          address: address ? undefined : 'Address is required',
          genderId: genderId ? undefined : 'Gender ID is required',
          telephoneNo: telephoneNo ? undefined : 'Telephone number is required'
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate dateOfBirth
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime()) || dob > new Date()) {
      return res.status(400).json({
        error: 'Invalid date of birth or future date'
      });
    }

    // Validate telephone number (basic check for digits and length)
    const telephoneRegex = /^\+?[\d\s-]{10,15}$/;
    if (!telephoneRegex.test(telephoneNo)) {
      return res.status(400).json({
        error: 'Invalid telephone number format (10-15 digits with optional + or spaces/dashes)'
      });
    }

    // Fetch the roleId for "Donor" from the Roles table
    const donorRole = await Role.findOne({ where: { name: 'Donor' } });
    if (!donorRole) {
      return res.status(400).json({
        error: 'Role "Donor" not found',
        details: 'Please ensure the "Donor" role exists in the Roles table'
      });
    }
    const roleId = donorRole.id;

    // Create donor with the automatically assigned roleId
    const donor = await Donor.create({
      name,
      email,
      password,
      bloodType,
      dateOfBirth,
      nic,
      address,
      genderId,
      roleId,
      telephoneNo
    });

    // Remove password from response
    const donorResponse = {
      id: donor.id,
      name: donor.name,
      email: donor.email,
      bloodType: donor.bloodType,
      dateOfBirth: donor.dateOfBirth,
      nic: donor.nic,
      address: donor.address,
      genderId: donor.genderId,
      roleId: donor.roleId, // Include the automatically assigned roleId
      telephoneNo: donor.telephoneNo,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt
    };

    return res.status(201).json({
      message: 'Donor registered successfully',
      data: donorResponse
    });

  } catch (error) {
    // Handle Sequelize validation errors
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

    // Handle unique constraint errors (e.g., email or nic already exists)
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        error: 'Duplicate entry',
        details: errors
      });
    }

    // Handle foreign key constraint errors (e.g., invalid genderId or roleId)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      const field = error.fields[0];
      return res.status(400).json({
        error: 'Foreign key constraint failed',
        details: {
          field: field === 'genderId' ? 'genderId' : 'roleId',
          message: `The ${field === 'genderId' ? 'gender' : 'role'} does not exist`
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
    console.error('Error registering donor:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred while registering the donor'
    });
  }
};

exports.getDonorCount = async (req, res) => {
  try {
    const donorCount = await Donor.count();
    res.status(200).json({ count: donorCount });
  } catch (error) {
    console.error('Error fetching donor count:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An error occurred while fetching the donor count',
    });
  }
};