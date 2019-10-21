const express = require('express');
const { check, validationResult } = require('express-validator');

const Contact = require('../models/Contact');

const router = new express.Router();

router.get('/contact', (req, res) => {
  res.render('contact');
});
  
router.post('/contact', [
  check('name')
    .not().isEmpty({ ignore_whitespace: true })
    .withMessage('Name is a required field (server)')
    .trim()
    .escape(),
  check('email')
    .isEmail()
    .withMessage('This is an invalid email, please check and try again!')
    .not().isEmpty({ ignore_whitespace: true })
    .withMessage('Email is a required filed (server)')
    .normalizeEmail(),
  check('message')
    .not().isEmpty({ ignore_whitespace: true })
    .withMessage('Unable to submit the form without a message.')
    .trim()
    .escape()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  console.log(req.connection.remoteAddress) // does this get the IP of the user of the site?
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let check = req.body.check;
 
  if(check) {
    console.log(check, ' bot detected');
    // perhaps write the ip to a log file? 
    return res.status(422).send();  // custom page sent back perhaps?
  }


  // store the contact in db and send email..
try {
  const contact = new Contact({
    name,
    email,
    message
  })

  await contact.save();
  res.status(201).send({msg: 'Thanks for contacting me, i\'ll get back to you soon.'})
} catch (e) {
  res.status(400).send(e.message);
}


})


module.exports = router;