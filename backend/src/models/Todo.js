const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  deadlineDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: "pending"
  },
  type: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'Category'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  }
}, {
  timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo; 