var db = require("../models");

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
  //
  // app.get("/api/weather", function(req, res) {
  //   // something something
  // }).then(function(results) {
  //   res.render(results);
  // }).catch(function(err, res) {
  //   if (err) {
  //     res.status(400).end();
  //   }
  // });
  //
  // app.get("/api/twit", function(req, res) {
  //   // something something
  // }).then(function(results) {
  //   res.render(results);
  // }).catch(function(err, res) {
  //   if (err) {
  //     res.status(400).end();
  //   }
  // });
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
  });
};
