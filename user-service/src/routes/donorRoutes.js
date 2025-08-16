const express = require("express");
const router = express.Router();
const donorController = require("../controllers/donorController");

router.post('/register', donorController.registerDonor);
router.get('/count', donorController.getDonorCount);

module.exports = router;