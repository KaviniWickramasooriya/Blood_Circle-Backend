const express = require("express");
const router = express.Router();
const eventOrganiserController = require("../controllers/eventOrganisorController");

router.post('/event-organiser', eventOrganiserController.createEventOrganiser);

module.exports = router;