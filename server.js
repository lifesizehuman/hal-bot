const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const db = require("./models");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: false}));

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

require("./routes/api-routes.js")(app);

db.sequelize.sync({force: true}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
