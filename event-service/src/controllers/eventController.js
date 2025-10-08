const { Op } = require('sequelize');
const sequelize = require('../config/db');
const Event = require('../models/Event')(sequelize);
const { getOrganizerEmail } = require('../services/userService');
const { sendApprovalEmail } = require('../services/emailService');

// Helper function to filter events based on user type
const filterEventsByUser = async (req, userType, organizerId = null) => {
  const whereClause = {};
  if (userType === 'EventOrganiser') {
    whereClause.organizerId = organizerId;
  }
  // For admin, no filter (all events)
  return whereClause;
};

// Create a new event (only event organizers)
const createEvent = async (req, res) => {
  try {
    const { name, date, time, endTime, location, district, description, expectedParticipants, maxCapacity } = req.body;
    const organizerId = req.user.id; // From auth middleware

    const event = await Event.create({
      name,
      date,
      time,
      endTime,
      location,
      district,
      description,
      organizerId,
      expectedParticipants,
      maxCapacity,
      status: 'pending' // Default for new events
    });

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully and pending approval'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create event'
    });
  }
};

// Get all events (filtered by user type)
const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;
    const userType = req.user.userType;

    const whereClause = await filterEventsByUser(req, userType, req.user.id);

    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { district: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Event.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['updatedAt'] } // Exclude if not needed
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(count / limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
};

// Public: Get all approved events (no token)
const getPublicEvents = async (req, res) => {
  try {
    const { status = 'approved', search } = req.query;
    const whereClause = { status };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { district: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const events = await Event.findAll({
      where: whereClause,
      order: [['date', 'ASC'], ['time', 'ASC']],
      attributes: { exclude: ['updatedAt'] }
    });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch public events'
    });
  }
};

// Get single event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userType = req.user.userType;

    const whereClause = { id };
    if (userType === 'EventOrganiser') {
      whereClause.organizerId = req.user.id;
    }

    const event = await Event.findOne({ where: whereClause });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
};

// Update event (organizer can update own any events, set to pending; admin can update any)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;
    const userType = req.user.userType;

    let whereClause = { id };
    if (userType === 'EventOrganiser') {
      whereClause.organizerId = req.user.id;
      // Ignore any status sent by organizer
      delete updates.status;
      // Set status to pending on update
      updates.status = 'pending';
    }
    // Admin can update anything, including status

    const [updatedRows] = await Event.update(updates, {
      where: whereClause,
      returning: true
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found or unauthorized to update'
      });
    }

    // Fetch updated event
    const updatedEvent = await Event.findByPk(id);
    res.json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update event'
    });
  }
};

// Delete event (hard delete; organizer can delete any own event, admin any)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userType = req.user.userType;

    let whereClause = { id };
    if (userType === 'EventOrganiser') {
      whereClause.organizerId = req.user.id;
      // Can delete any own event, no status restriction
    }

    const deletedRows = await Event.destroy({ where: whereClause });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found or unauthorized to delete'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event'
    });
  }
};

// Admin-only: Approve/Reject event
const approveEvent = async (req, res) => {
  try {
    if (req.user.userType !== 'Admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access only'
      });
    }

    const { id } = req.params;
    const { status, rejectionReason } = req.body; // status: 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be approved or rejected'
      });
    }

    const [updatedRows] = await Event.update(
      { status, rejectionReason },
      { where: { id, status: 'pending' } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pending event not found'
      });
    }

    // If approved, send email notification to organizer
    if (status === 'approved') {
      const event = await Event.findByPk(id);
      const organizerEmail = await getOrganizerEmail(event.organizerId);
      await sendApprovalEmail(organizerEmail, event.name);
    }

    res.json({
      success: true,
      message: `Event ${status} successfully`
    });
  } catch (error) {
    console.error('Error approving event:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to approve event'
    });
  }   
};

module.exports = {
  createEvent,
  getAllEvents,
  getPublicEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  approveEvent
};