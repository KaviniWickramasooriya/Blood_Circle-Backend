
const express = require('express');
const router = express.Router();
const bloodController = require('../controllers/bloodController');

router.get('/', bloodController.getAllBloodRecords);
router.get('/:id', bloodController.getBloodRecordById);
router.post('/', bloodController.createBlood);
router.put('/:id', bloodController.updateBloodRecord);
router.delete('/:id', bloodController.deleteBloodRecord);


// POST /api/blood
router.post('/', bloodController.createBlood);

module.exports = router;
