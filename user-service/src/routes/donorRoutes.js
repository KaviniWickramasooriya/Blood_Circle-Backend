const express = require("express");
const router = express.Router();
const donorController = require("../controllers/donorController");

router.post('/donor', donorController.createDonor);

module.exports = router;