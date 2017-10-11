var keys = require("../config/keys.js");

var twilio = require('twilio');

// Find your account sid and auth token in your Twilio account Console.
var client = new twilio(keys.info.twilioSID, keys.info.twilioToken);

// Send the text message.
client.messages.create({
  to: keys.info.verifiedNum,
  from: keys.info.twilioNum,
  body: 'Hello from Twilio!'
});