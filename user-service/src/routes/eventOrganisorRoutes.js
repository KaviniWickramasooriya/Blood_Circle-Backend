const express = require("express");
const router = express.Router();
const eventOrganiserController = require("../controllers/eventOrganisorController");

router.post('/register', eventOrganiserController.createEventOrganiser);
router.get('/', eventOrganiserController.getOrganisorCount);

module.exports = router;