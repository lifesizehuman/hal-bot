var db = require("../models");

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
  // app.get("/api/movie", function(req, res) {
  //   // something something
  // }).then(function(results) {
  //   res.render(results);
  // }).catch(function(err, res) {
  //   if (err) {
  //     res.status(400).end();
  //   }
  // });
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
};
