var request = require("request");
var keys = require("../config/keys.js");

var search = process.argv[2] || "Irvine";

request("http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=" + keys.info.accuKey + "&q=" + search, function(err, res, body) {
  if (err) throw err;

  var info = JSON.parse(body);
  console.log(info[0].Key);
});