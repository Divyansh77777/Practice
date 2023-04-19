const express = require('express');
require("dotenv").config();

const {connection} = require("./Config/db")
const app = express();
app.use(express.json());

const {userRouter} = require("./Routes/User.routes")
const {authMiddleware} = require("./Middlewares/Authentication")
const {blogRouter} = require("./Routes/Blogs.routes")



app.use("/user",userRouter);
app.use(authMiddleware)
app.use("/blog",blogRouter)


app.listen(process.env.PORT,async()=>{

    try{

        await connection;

        console.log("Connected to DB")

    }
    catch(err){
        console.log(err.message)
    }

})