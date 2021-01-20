// Required Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 3000;

// Create express app instance.
const app = express();

// HTTP request logger middleware
app.use(logger("dev"));

app.use(compression());
// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static content for the app from the public folder
app.use(express.static("public"));

//Connect to the database
mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// Give the server access to the routes
app.use(require("./routes/api.js"));

// Start our server so it can listen for requests from the client
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
