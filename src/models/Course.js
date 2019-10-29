const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    max: [5, 'Number can\'t be more than five'],
    default: -1, // which implies not yet reviewed.
  },
  review: {
    type: String,
    default: 'Has a tendency to overuse certain phrases, such as "crack open" referring to the opening of a file, and overusing a term I personally would reserve for boiled eggs, not files.',
    trim: true,
  },
  keyTakeaways: {
    type: String,
    trim: true
  },
  BuiltFromCourse: [{
    project: {
      type: String,
      trim: true 
    }
  }]
},{
  timestamps: true
})


