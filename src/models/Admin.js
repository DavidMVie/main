const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    maxlength: 20,
    minlength: 2
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    trim: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})


adminSchema.pre('save', async function(next) {
 if(this.isModified('password')) {
  this.password =   await bcrypt.hash(this.password, 8)
  next();
 }else {
   next();
 }
})

adminSchema.methods.getAuthToken = async function() {

  const token = await jwt.sign({_id: this._id}, 'bsleoaitdgjb&&)L?/!d', {expiresIn: '1 day'})
  this.tokens = this.tokens.concat({token});
  return token;
}

adminSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await AdminUser.findOne({email});
    if(!user) {
      throw new Error('Unable to login');
    }
    console.log('password ', password );
    console.log('user.passowrd ', user.password)
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      throw new Error('Unable to login 2');
    }
    return user;
  } catch (e) {
    throw new Error(e.message);
  }
}

const AdminUser = mongoose.model('AdminUser', adminSchema);

module.exports = AdminUser;