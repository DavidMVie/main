const jwt = require('jsonwebtoken');

const AdminUser = require('../models/Admin')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) { throw new Error('Not authorized') }
    const decode = jwt.verify(token, 'bsleoaitdgjb&&)L?/!d');
    const user = await AdminUser.find({_id: decode._id, 'tokens.token': token})
    if(!user) {
      res.status(401).send(e.message);
    } 
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send(e.message);
  }
}

module.exports = auth;