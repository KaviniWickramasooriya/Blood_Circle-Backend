const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

router.post('/role', roleController.createRole);

module.exports = router;