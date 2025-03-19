const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../models');
let Patient;

// Initialize Patient model after database is ready
db.then(models => {
  Patient = models.Patient;
}).catch(err => {
  console.error('Failed to initialize Patient model:', err);
});

const { Op } = require('sequelize');

// @route   GET api/patients
// @desc    Get all patients (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    const whereConditions = {
      isDeleted: false // Only show non-deleted patients by default
    };
    
    // Add search functionality if search parameter is provided
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Get patients with pagination
    const { count, rows: patients } = await Patient.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      patients,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalPatients: count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/patients/:id
// @desc    Get patient by ID
// @access  Public
router.get('/:id', async (req, res) => {
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
    
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/patients
// @desc    Register a new patient
// @access  Public
router.post(
  '/',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number must be exactly 11 digits').matches(/^\d{11}$/),
    check('address', 'Address is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('zipCode', 'Zip code must be exactly 4 digits').matches(/^\d{4}$/)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if patient with email already exists
      const existingPatient = await Patient.findOne({
        where: { email: req.body.email }
      });
      
      if (existingPatient) {
        return res.status(400).json({ msg: 'Patient with this email already exists' });
      }
      
      // Create new patient
      const patient = await Patient.create(req.body);
      
      res.json(patient);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/patients/:id
// @desc    Update patient information
// @access  Public
router.put('/:id', [
  check('zipCode', 'Zip code must be exactly 4 digits').matches(/^\d{4}$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let patient = await Patient.findOne({
      where: {
        id: req.params.id,
        isDeleted: false
      }
    });
    
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    // Merge existing data with updates
    const updatedData = {
      ...patient.get(),
      ...req.body
    };
    delete updatedData.id; // Prevent id from being updated
    
    // Update patient with merged data
    await patient.update(updatedData);
    
    // Get updated patient
    patient = await Patient.findByPk(req.params.id);
    
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/patients/:id
// @desc    Soft delete a patient
// @access  Public
router.delete('/:id', async (req, res) => {
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
    
    // Use Sequelize's built-in paranoid deletion
    await patient.destroy();
    
    // Also update our custom isDeleted flag
    await patient.update({
      isDeleted: true
    });
    
    res.json({ msg: 'Patient removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/patients/:id/restore
// @desc    Restore a soft-deleted patient
// @access  Public
router.put('/:id/restore', async (req, res) => {
  try {
    // Find the deleted patient (paranoid: false to include soft-deleted records)
    const patient = await Patient.findOne({
      where: {
        id: req.params.id,
        isDeleted: true
      },
      paranoid: false
    });
    
    if (!patient) {
      return res.status(404).json({ msg: 'Deleted patient not found' });
    }
    
    // Restore patient using Sequelize's built-in restore method
    await patient.restore();
    
    // Also update our custom isDeleted flag
    await patient.update({
      isDeleted: false
    });
    
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/patients/deleted
// @desc    Get all soft-deleted patients
// @access  Public
router.get('/deleted/all', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get deleted patients with pagination
    const { count, rows: patients } = await Patient.findAndCountAll({
      where: { isDeleted: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['deletedAt', 'DESC']],
      paranoid: false // Include soft-deleted records
    });
    
    res.json({
      patients,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalPatients: count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/patients/:id/permanent
// @desc    Permanently delete a patient
// @access  Public
router.delete('/:id/permanent', async (req, res) => {
  try {
    // Find the deleted patient (paranoid: false to include soft-deleted records)
    const patient = await Patient.findOne({
      where: {
        id: req.params.id,
        isDeleted: true
      },
      paranoid: false
    });
    
    if (!patient) {
      return res.status(404).json({ msg: 'Deleted patient not found' });
    }
    
    // Permanently delete the patient (force: true bypasses paranoid mode)
    await patient.destroy({ force: true });
    
    res.json({ msg: 'Patient permanently deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;