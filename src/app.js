//importng express
const express = require("express");

//creating the express app
const app = express();

// Handling requests to the "/hello" route
//instead of use - get
app.use("/hello", (req, res) => {
  res.send("Hello!!!! Welcome to my project ");
});
app.use("/hi", (req, res) => {
  res.send("Hiiiiiii!!!! Welcome to my project ");
});
app.use("/greet", (req, res) => {
  res.send("Greetings from ARUL !!!! Welcome to my project ");
});

// Starting the server on port 1313 with a callback function
app.listen(1313, () => {
  console.log("Express Server starts...");
});
