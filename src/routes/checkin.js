const express = require('express');
const router = express.Router();
const db = require('../models');
let Patient;

// Initialize Patient model after database is ready
db.then(models => {
  Patient = models.Patient;
}).catch(err => {
  console.error('Failed to initialize Patient model:', err);
});

// @route   PUT api/checkin/:id
// @desc    Check in a patient
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: {
        id: req.params.id,
        isDeleted: false
      }
    });
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    // Set check-in time to current time
    await patient.update({
      checkInTime: new Date()
    });
    
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/checkin/:id/reset
// @desc    Reset a patient's check-in time
// @access  Public
router.put('/:id/reset', async (req, res) => {
  try {
    const patient = await Patient.findOne({
      where: {
        id: req.params.id,
        isDeleted: false
      }
    });
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    await patient.update({
      checkInTime: null
    });
    
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
