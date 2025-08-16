const express = require("express");
const router = express.Router();
const donorController = require("../controllers/donorController");
const authMiddleware = require("../middleware/auth");

router.post('/register', donorController.registerDonor);
router.get('/count',authMiddleware('Admin'), donorController.getDonorCount);

module.exports = router;