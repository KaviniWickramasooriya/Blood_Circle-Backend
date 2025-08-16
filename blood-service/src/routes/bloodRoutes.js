
const express = require('express');
const router = express.Router();
const bloodController = require('../controllers/bloodController');

router.get('/', bloodController.getAllBloodRecords);
router.get('/:id', bloodController.getBloodRecordById);
router.put('/:id', bloodController.updateBloodRecord);
router.delete('/:id', bloodController.deleteBloodRecord);


// POST /api/blood
router.post('/', bloodController.createBlood);
router.get('/', async (req, res) => {
    try {
      const bloodRecords = await Blood.find();
      res.json(bloodRecords);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
