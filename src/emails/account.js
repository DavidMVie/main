const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

sgMail.send({
  to: 'davidmillarvie@hotmail.co.uk',
  from: 'david.millarvie@yahoo.com',
  subject: 'Test Email',
  text: 'I hope this email reaches you!'
})

