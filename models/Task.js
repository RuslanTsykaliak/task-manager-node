const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name cannot be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
})

// Adding post-save middleware to catch errors
TaskSchema.post('save', function (error, doc, next) {
  if (error.name === 'ValidationError') {
    // Handle validation errors
    const validationErrors = Object.values(error.errors).map(err => err.message);
    next(new Error(`Validation error: ${validationErrors.join(', ')}`));
  } else {
    // Handle other errors
    next(error);
  }
});

module.exports = mongoose.model('Task', TaskSchema)
