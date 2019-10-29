const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);


function emailContactReceivedClient(name, email) {
  sgMail.send({
    to: email,
    from: 'david.millarvie@yahoo.com',
    subject: 'Contact Received',
    message: `Hi ${name},  just got your message, I'll get back to you soon,  cheers, David`,
    html: `Hi ${name},  just got your message, I'll get back to you soon, <br>  Cheers, David`
  }).then(() => {
    console.log('message sent')
  }).catch((e) => {
    console.log(e.message)
  })

}


function emailContactReceivedMe(name, email, message, id) {
  sgMail.send({
    to: 'david.millarvie@yahoo.com',
    from: 'david.millarvie@yahoo.com',
    subject: `Contact Received from ${email}`,
    message: `From ${name},   ${message},  Id: ${id}`,
    html: `From ${name},   <br> ${message},  <br>  Id: ${id}`,
  }).then(() => {
    console.log('message sent')
  }).catch((e) => {
    console.log(e.message)
  })
}

module.exports = {
  emailContactReceivedClient,
  emailContactReceivedMe
}
