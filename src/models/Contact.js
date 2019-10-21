const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 4,
    trim: true
  },
  message: {
    type: String,
    required: true,
    minlength: 1, 
    trim: true,
    maxlength: 400 // not sure should do this...
  }
},{
  timestamps: true
})


const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;