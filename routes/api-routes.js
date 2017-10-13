const db = require("../models");
const keys = require("../config/keys.js");
const WheresWaldo = require("../src/WheresWaldo.js");
const ww = new WheresWaldo();

const request = require("request");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/api/query/:q", function(req, res) {
    let queryAction = ww.action(req.params.q);
    let redPath = `/api/${queryAction.action}/${queryAction.query}`;

    // Ajax request
    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      res.json({address: redPath});
    } else { // Browser request
      res.redirect(redPath);
    }
  });

  app.get("/api/math/:q", function(req, res) {
    // const search = req.params.q;
    res.render("math");
  });

  app.get("/api/weather/:q", function(req, res) {
    const search = req.params.q;
    const queryUrl = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=" + keys.info.accuKey + "&q=" + search;

    request(queryUrl, function(err, response, body) {
      if (err)
        throw err;
      const info = JSON.parse(body);
      res.render("weather", info[0]);
    });
  });

  app.get("/api/movie/:q", function(req, res) {
    const query = req.params.q;

    const queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(response, body) {
      const content = JSON.parse(body.body);

      const values = {
        title: content.Title,
        year: content.Year,
        rating: content.imdbRating,
        country: content.Country,
        language: content.Language,
        actors: content.Actors,
        plot: content.Plot,
        poster: content.Poster
      };
      res.render("movies", values);
    });
  });

  app.get("/api/wiki/:q", function(req, res) {
    let query = req.params.q;
    console.log(query);
    query = query.replace(/ /g, "%20");
    const queryUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&utf8=&format=json&srsearch=${query}`;
    request(queryUrl, function(error, body) {
      let parsed = JSON.parse(body.body);
      let query = parsed.query;
      let search = query.search;
      let entry = search[0];
      let pageid = (entry)
        ? entry.pageid - 0
        : null;
      if (pageid) {
        res.render("wiki", {pageid: pageid});
      } else {
        res.render("404");
      }
    });
  });

  app.get("/", function(req, res) {
    db.Todo.findAll({
      include: [db.User]
    }).then(function(dbTodo) {
      res.render("index", {todo: dbTodo});
    });
  });

  app.post("/api/newTodo", function(req, res) {
    db.Todo.create({
      task: req.body.task,// Someplace
    }).then(function(dbTodo) {
      res.redirect("/");
    });
  });

  app.put("/", function(req, res) {
    db.Todo.update({
      task: req.body.task, // Someplace
      complete: req.body.complete // Someplace
    }, {
      where: {
        id: req.body.id // Someplace
      }
    }).then(function(dbTodo) {
      res.redirect("/");
    });
  });

  app.delete("/", function(req, res) {
    db.Todo.destroy({
      where: {
        id: req.body.id // Someplace
      }
    }).then(function(dbTodo) {
      res.redirect("/");
    });
  });
};
