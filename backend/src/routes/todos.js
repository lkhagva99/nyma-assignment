const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

// Get all todos for the authenticated user
router.get('/', auth, async (req, res) => {
  const { category } = req.query;
  try {
    let todos = [];
    if (category && category !== 'all') {
      console.log('Category from query:', category);
      const categoryId = new mongoose.Types.ObjectId(category);
      console.log('Query params:', { studentId: req.user._id, categoryId });
      todos = await Todo.find({ studentId: req.user._id, categoryId }).sort({ createdAt: -1 });
      console.log('Query result:', todos);
    } else {
      todos = await Todo.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    }
    res.json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching todos', error: error.message });
  }
});

// Create a new todo
router.post('/', auth, async (req, res) => {
  try { 
    const categoryId = req.body.category ? new mongoose.Types.ObjectId(req.body.category) : null;
    const todo = new Todo({
      ...req.body,
      studentId: req.user._id,
      categoryId: categoryId
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating todo', error: error.message });
  }
});

// Update a todo
router.patch('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, studentId: req.user._id });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    Object.assign(todo, req.body);
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating todo', error: error.message });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, studentId: req.user._id });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    await todo.deleteOne();
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting todo', error: error.message });
  }
});

module.exports = router; 