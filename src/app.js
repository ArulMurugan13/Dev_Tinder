//importng express
const express = require("express");
//creating the express app
const app = express();
//importing db connction
const connectDb = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//middleware - no path - runs for all -
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//helps to convert json to js obj
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter.js");
const profileRouter = require("./routes/profileRouter.js");
const requestRouter = require("./routes/requestRouter.js");
const userRouter = require("./routes/userRouter.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("DB is connected successfully");
    app.listen(3000, () => {
      console.log("Server Starts Running... listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Something went wrong db is not connected");
  });

app.use("/user", (req, res) => {});
