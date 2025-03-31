const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { studentCode, password, lastName, firstName } = req.body;
    
    // Check if user already exists
    const existingUser = await Student.findOne({ studentCode });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const student = new Student({ studentCode, password, lastName, firstName });
    await student.save();

    // Generate token
    const token = jwt.sign(
      { userId: student._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ student: { id: student._id, studentCode: student.studentCode }, token });
  } catch (error) {
    res.status(400).json({ message: 'Error creating student', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { studentCode, password } = req.body;
    
    // Find user
    const student = await Student.findOne({ studentCode });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: student._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ student: { id: student._id, studentCode: student.studentCode }, token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router; 