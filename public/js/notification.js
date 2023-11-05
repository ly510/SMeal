const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONENUMBER;

const client = new twilio(accountSid, authToken);

function sendWhatsAppMessage(messageBody, toNumber) {
  client.messages.create({
    body: messageBody,
    from: `whatsapp:${fromNumber}`,
    to: `whatsapp:${toNumber}`,
  });
}

function sendSMS(messageBody, toNumber) {
  client.messages.create({
    body: messageBody,
    from: `${fromNumber}`,
    to: `${toNumber}`,
  }).then(message => console.log(message.sid));
}

module.exports = { sendWhatsAppMessage, sendSMS };