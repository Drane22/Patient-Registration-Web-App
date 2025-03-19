const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../models');
let Patient;

db.then(models => {
  Patient = models.Patient;
}).catch(err => {
  console.error('Failed to initialize Patient model:', err);
});

const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const whereConditions = {
      isDeleted: false
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
    
    const updatedData = {
      ...patient.get(),
      ...req.body
    };
    delete updatedData.id; 
    
    await patient.update(updatedData);
    
    patient = await Patient.findByPk(req.params.id);
    
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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
  
    await patient.destroy();
    await patient.update({
      isDeleted: true
    });
    
    res.json({ msg: 'Patient removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


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
    
    await patient.restore();
    await patient.update({
      isDeleted: false
    });
    
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/deleted/all', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
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
