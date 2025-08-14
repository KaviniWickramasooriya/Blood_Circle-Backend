const express = require("express");
const router = express.Router();
const genderController = require("../controllers/genderController");

router.post('/gender', genderController.createGender);

module.exports = router;