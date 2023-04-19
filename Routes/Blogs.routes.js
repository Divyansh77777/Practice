const express = require("express");
const bcrypt = require("bcrypt");
const blogRouter = express.Router();
const jwt = require("jsonwebtoken")
const authorise = require("../Middlewares/Authorization")
const { blogmodel } = require("../Models/Blog.model");


//Blog Creation
blogRouter.post("/create", async (req, res) => {

    const token = req.headers.authorization?.split(" ")[1]
    try {

        if (token) {
            jwt.verify(token, process.env.JWT_TOKEN_SECRETKEY, async (err, payload) => {
                if (payload) {

                    const user_id = payload.user_id
                    const { type, amount } = req.body;

                    const blog = new blogmodel({ user_id, type, amount });
                    blog.save()
                    res.status(200).send({ msg: "Blog Created" })
                } else {
                    res.status(400).send({ msg: "Something Wrong" })
                }
            })
        }

    } catch (error) {
        res.status(400).send({ msg: "Something Wrong" })
    }

})


//Read Blog
blogRouter.get("/read",authorise(["User","Moderator"]),async (req,res)=>{
    const token=req.headers.authorization.split(" ")[1];
    try {
        if(token){
            jwt.verify(token,process.env.JWT_TOKEN_SECRETKEY,async(err,payload)=>{
                if(payload){
                    const uid=payload.user_id

                    const blogs=await blogmodel.find({user_id:uid});
                    res.status(200).send({msg:"Blogs Showling",Blogs:blogs})
                }else{
                    res.status(500).send({msg:"Something Wrong"})
                }
            })
        }else{
            res.status(400).send({msg:"Please login first"})
        }
    } catch (error) {
        res.status(400).send({msg:"Something went wrong",err:error.message})
    }
    
})


blogRouter.patch("/update/:id",authorise(
    ["Moderator"]
),async(req,res)=>{
    try {
        const id=req.params.id;
        const payload=req.body;
        await blogmodel.findByIdAndUpdate(id,payload)
        res.send({"msg":`Blog with id:${id} has been updated`})
    } catch (error) {
        res.send({msg:error.message})
    
    }
})


blogRouter.delete('/delete/:id',authorise(
    ["User","Moderator"]
),async(req,res)=>{
    const blogid=req.params.id;
    await blogmodel.findByIdAndDelete({_id:blogid})
    res.send({"msg":`Blog with id:${blogid} has been deleted`})
})




module.exports={blogRouter}