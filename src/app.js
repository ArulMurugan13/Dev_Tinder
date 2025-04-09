//importng express
const express = require("express");
//creating the express app
const app = express();

//importing db connction
const connectDb = require("./config/database.js");
const User = require("./models/users.js");

//middleware - no path - runs for all -
//helps to convert json to js obj
app.use(express.json());

//post api
app.post("/signup", async (req, res) => {
  // {fname:"Arivu",lname:"Selvan",age:23,city:"Ariyalur"}

  try {
    const newUserObj = new User(req.body);
    await newUserObj.validate();
    await newUserObj.save();
    res.status(200).send("User Added Successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//get all user
app.get("/getUser", async (req, res) => {
  const data = await User.find();
  res.status(200).send(data);
});
//get  user by fname
app.get("/getUserByName", async (req, res) => {
  const name = req.body.fname;

  try {
    const data = await User.findOne({ fname: name });

    if (data) {
      res.status(200).send(data);
    } else {
      res.status(401).send("Unable to fetch by ", name);
    }
  } catch (err) {
    console.log("Something went wrong");
    res.status(400).send(err.message);
  }
});

//get user by id from url
app.get("/getUser/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const data = await User.findOne({_id:userId});

    if (data) {
      res.status(200).send(data);
    } else {
      res.status(401).send("Unable to fetch by ", name);
    }
  } catch (err) {
    console.log("Something went wrong");
    res.status(400).send(err.message);
  }
});

//Delete api
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  const deleteUser = await User.findByIdAndDelete(userId);
  res.send("User Deleted Successfully");
});
//delete all document
app.delete("/deleteAllUser", async (req, res) => {
  const deleteAllData = await User.deleteMany({});
  res.send("All Data are deleted...");
});

//adding a field
app.patch("/addEmailField", async (req, res) => {
  const addingField = await User.updateMany(
    {},
    { $set: { email: "abc@gmail.com" } }
  );
  res.send("Email field added successfully");
});

//updating email by id

app.patch("/updateEmail", async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findOne({ _id: userId });
  const username = user?.fname;
  // updateEmail
  await User.findByIdAndUpdate(userId, {
    $set: { email: username + "@gmail.com" },
  });

  res.send("Email id updated successfully");
});

connectDb()
  .then(() => {
    console.log("DB is connected successfully");
    app.listen(3000, () => {
      console.log("Server Starts Running... listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Something went wrong db is not cponnected");
  });

app.use("/user", (req, res) => {});
