//importng express
const express = require("express");

//creating the express app
const app = express();

//Multiware - sits between req and res , Request handler - which sends res to the req 
//app.use("/path" , [rh1,rh2,rh3],rh4,rh5) - executes by order - only one res will be send

app.use(
  "/user",
  (req, res, next) => {
    console.log("user Request handler 1");
    // res.send({ nmae: "Arul", age: 24 });
    next();
  },
  (req, res,next) => {
    console.log("user Request handler 2");
    next();
    res.send({ namee: "Arivu", age: 23 });
  },
  (req, res) => {
    console.log("user Request handler 3");
    res.send({ name: "gopi", age: 23 });
  }
);

app.listen(3000 , ()=>{
    console.log("Server Starts Running");
})
