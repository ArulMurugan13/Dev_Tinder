//importng express
const express = require("express");

//creating the express app
const app = express();

//Handling Auth middleware

// app.use("/admin/getAllData" , (req,res)=>{
//     const admin = "Arul";
//     const isAdmin = admin==="Arul_Murugan";
//     if(isAdmin)
//     {
//         res.status(200).send("user is Authorized as Admin ");
//     }
//     else
//     {
//         res.status(401).send("User is Unauthorized");
//     }

// });
app.use("/admin" , (req,res,next)=>{
    const admin = "Arul_Murugan";
    const isAdminAuthorized = admin==="Arul_Murugan";
    if (!isAdminAuthorized) {
      res.status(401).send("User is Unauthorized");
    }
    else
    {
        console.log("Admin is Authorized")
        next();
    }
});

app.use("/admin/getAllData", (req, res)=>{
    res.send("All User Data fetched");
});
   
app.use("/admin/deleteUser",(req,res)=>{
    res.send("User data is deleted successfully")
});
app.listen(3000 , ()=>{
    console.log("Server Starts Running...");
})
