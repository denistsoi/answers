// twillio client
const accountSid = process.env.TWILIO_ID;
const authToken = process.env.TWILIO_TOKEN;
const LookupsClient = require('twilio').LookupsClient;
const client = new LookupsClient(accountSid, authToken);
 
// '+15108675309';
// '+85261936919';
// (+44)01501823028
// +44 7700 900879
client.phoneNumbers('+52 664 123 45 67').get((error, number) => {
  console.log(number);
  // console.log(number.national_format);
  // console.log(number.country_code);
  
  // This will sometimes be null
  // console.log(number.caller_name);
});