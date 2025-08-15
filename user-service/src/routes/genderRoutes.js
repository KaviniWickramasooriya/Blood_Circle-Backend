const express = require("express");
const router = express.Router();
const genderController = require("../controllers/genderController");

router.post('/gender', genderController.createGender);
router.get('/gender', genderController.getAllGenders);

module.exports = router;