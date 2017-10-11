var db = require("../models");
var keys = require("../config/keys.js");

var request = require("request");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
  });
  //
  // app.get("/api/query", function(req, res) {
  //   // something something
  // }).then(function(results) {
  //   res.render(results);
  // }).catch(function(err, res) {
  //   if (err) {
  //     res.status(400).end();
  //   }
  // });
  
  app.get("/api/weather/:search", function(req, res) {
    var search = req.params.search;
    var queryUrl = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=" + keys.info.accuKey + "&q=" + search;

    request(queryUrl, function(err, response, body) {
      if (err) throw err;
      var info = JSON.parse(body);
      res.render("weather", info[0]);
    });
  });
  
  app.get("/api/twit/:tweet", function(req, res) {
    var Twitter = require("twitter");
    var tweet = req.params.tweet;
    var searchURL = "https://api.twitter.com/1.1/users/search.json?q=" + tweet + "&page=1&count=3";

    var twit = new Twitter({
      consumer_key: keys.twitterKeys.consumer_key,
      consumer_secret: keys.twitterKeys.consumer_secret,
      access_token_key: keys.twitterKeys.access_token_key,
      access_token_secret: keys.twitterKeys.access_token_secret
    });

    twit.get(searchURL, function(error, tweets, response) {
      if (!error) {
        var handle = tweets[0].screen_name;
        var realName = tweets[0].name;
        var followers = tweets[0].followers_count;
        var friends = tweets[0].friends_count;
        var tweetCount = tweets[0].statuses_count;

        var twitterURL = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + handle + "&limit=20";

        twit.get(twitterURL, function(tweets, response) {
          var stats = {
            realName: realName,
            userName: handle,
            tweetCount: tweetCount,
            followerCount: followers,
            followingCount: friends
          };
          res.render("tweets", stats);
        });
      }
      //
      app.get("/api/movie/:query", function(req, res) {
        var query = req.params.query;

        var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=40e9cece";

        request(queryUrl, function(response, body) {
          // console.log("$$$"+Reflect.ownKeys(body));
          // console.log("%%%"+body["body"]);
          var content = JSON.parse(body.body);

          var values = {
            title: content.Title,
            year: content.Year,
            rating: content.imdbRating,
            country: content.Country,
            language: content.Language,
            actors: content.Actors,
            plot: content.Plot
          };
          console.log(values);
          res.render("movies", values);
        });
      });
    });
  });
};

//
// app.get("/api/wiki", function(req, res) {
//   // something something
// }).then(function(results) {
//   res.render(results);
// }).catch(function(err, res) {
//   if (err) {
//     res.status(400).end();
//   }
// });
//
// app.post("/api/search", function(req, res) {
//   // something something recent searches of population
// }).then(function(results) {
//   res.render(results);
// }).catch(function(err, res) {
//   if (err) {
//     res.status(400).end();
//   }
// });
