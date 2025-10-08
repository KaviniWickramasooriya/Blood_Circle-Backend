const axios = require('axios');

// Function to fetch organizer email from user-service API
// Assumes user-service has an endpoint like GET /api/organizers/:id that returns { email: '...' }
const getOrganizerEmail = async (organizerId) => {
  try {
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/organizers/${organizerId}`, {
      timeout: 5000  // 5 second timeout
    });
    return response.data.email;
  } catch (error) {
    console.error('Error fetching organizer email:', error.message);
    throw new Error('Failed to fetch organizer details');
  }
};

module.exports = { getOrganizerEmail };