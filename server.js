var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: false}));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

require("./routes/api-routes.js")(app);

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
