const db = require("../models");
const keys = require("../config/keys.js");
const WheresWaldo = require("../src/WheresWaldo.js");
const ww = new WheresWaldo();
const cheerio = require("cheerio");
const request = require("request");
const math  = require("mathjs");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/api/query/:q", function(req, res) {
    let queryAction = ww.action(req.params.q);
    let redPath = `/api/${queryAction.action}/${queryAction.query}`;
    db.Search.create({
      search_phrase: req.params.q
    });
    // Ajax request
    if (req.headers["x-requested-with"] === "XMLHttpRequest") {
      res.json({address: redPath});
    } else { // Browser request
      res.redirect(redPath);
    }
  });

  app.get("/api/recent/", function(req, res) {
    db.Search.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]]
    }).then(function(dbSearch) {
      res.json(dbSearch);
    });
  });

  app.get("/api/math/:q", function(req, res) {
    const eq = req.params.q;
    try {
      let ans = math.eval(eq);
      res.render("math", {eq:ans});
    } catch(e) {
      res.render("math", {eq:eq})
    }
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

  app.post("/api/newUser/:id", function(req, res) {
    let id = req.params.id;
    db.User.findOrCreate({
      where: {
        fb_ID: id
      }
    }).then(function() {
      res.end();
    });
  });

  app.get("/api/todo/:id", function(req, res) {
    let id = req.params.id;
    let query = {};
    if (req.query.id) {
      query.UserID = req.query.fb_ID;
    }
    db.Todo.findAll({
      where: {
        UserId: id,
        complete: false
      },
      include: [{ model: db.User }]
    }).then(function(dbTodo) {
      res.json(dbTodo);
    });
  });

  app.post("/api/todo/", function(req, res) {
    db.Todo.create({
      task: req.body.task,
      UserId: req.body.id
    }).then(function(dbTodo) {
      res.json(dbTodo);
    });
  });

  app.put("/api/todo/", function(req, res) {
    let reqs = req.body;
    let updateObj = {};

    if(reqs.complete) {
      updateObj.complete = reqs.complete;
    }

    if(reqs.task) {
      updateObj.task = reqs.task;
    }

    db.Todo.update(updateObj, {
      where: {
        id: req.params.id // Someplace
      }
    });
  });

  app.delete("/api/todo/:id", function(req, res) {
    db.Todo.destroy({
      where: {
        id: req.params.id // Someplace
      }
    }).then(function(dbTodo) {
      res.json(dbTodo);
    });
  });

  app.get("/api/twitter/:term", function(req, res) {
     let term = req.params.term;
     let queryUrl = "https://publish.twitter.com/oembed?url=https://twitter.com/" + term;

     request(queryUrl, function(response, body) {
      try {
        let obj = {twit: JSON.parse(body.body).html};
        res.render("tweets", obj);
      } catch(e) {
        res.render("404");
      }
     });
   });
};
