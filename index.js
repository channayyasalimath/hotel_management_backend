const express = require("express");
const app = express();

app.use(express.json());

//Database connection
const db = require("./db");

//Passport auth
const passport = require("./auth");

//bodyParser
const bodyParser = require("body-parser"); //req.body
app.use(bodyParser.json());

//Middleware Function
const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl}`
  );
  next(); //Move on to the next phase
};
app.use(logRequest);

//Passport authentication
app.use(passport.initialize());
const localAuthMiddleWare = passport.authenticate("local", { session: false });

//Route
app.get("/", function (req, res) {
  res.send("Welcome to our Hotel");
});

//PersonRoutes
const personRoutes = require("./routes/personsRoutes");
app.use("/person", personRoutes);

//menuRoutes
const menuRoutes = require("./routes/menuRoutes");
app.use("/menuItem",localAuthMiddleWare, menuRoutes);


app.listen(2000, () => {
  console.log("Server is running on 2000");
});
