const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all categories for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
  }
});

// Create a new category
router.post('/', auth, async (req, res) => {
  try {
    const category = new Category({
      ...req.body,
      studentId: req.user._id
    });
    await category.save();
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating category', error: error.message });
  }
});

// Update a category
router.patch('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, studentId: req.user._id });
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    Object.assign(category, req.body);
    await category.save();
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating category', error: error.message });
  }
});

// Delete a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, studentId: req.user._id });
  
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
  }
});

module.exports = router; 