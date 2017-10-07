var keys = require("../config/keys.js");

var twilio = require('twilio');

// Find your account sid and auth token in your Twilio account Console.
var client = new twilio(keys.TWILIO_ACCOUNT_SID, keys.TWILIO_AUTH_TOKEN);

// Send the text message.
client.messages.create({
  to: keys.to,
  from: keys.from,
  body: 'Hello from Twilio!'
});