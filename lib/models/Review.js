const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectById,
    required: true
  },
  review: {
    type: String,
    maxlength: 140,
    required: true
  },
  film: {
    type: mongoose.Schema.Types.ObjectById,
    required: true
  },
  createdAt: Date,
  updatedAt: Date

});

module.exports = mongoose.model('Review', reviewSchema);

