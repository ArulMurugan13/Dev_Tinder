//importng express
const express = require("express");
//creating the express app
const app = express();

//importing db connction
const connectDb = require("./config/database.js")

const User = require("./models/users.js");


//post api

app.post("/signup",async (req,res)=>{

    const newUserObj = new User({fname:"Arivu",lname:"Selvan",age:23,city:"Ariyalur"});
    
    await newUserObj.save();

    res.status(200).send("User Added Successfully");

});
app.get("/getUser",async (req,res)=>{
    
    const data = await  User.find();
    res.status(200).send(data);

});


connectDb().then( ()=>{
        console.log("DB is connected successfully");
        app.listen(3000, () => {
          console.log("Server Starts Running... listening on port 3000");
        });
        
        }).catch( (err)=>{
             console.log("Something went wrong db is not cponnected");
});

app.use("/user",(req,res)=>{

});



