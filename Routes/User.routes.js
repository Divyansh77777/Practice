const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {usermodel} = require("../Models/User.model");
const {blacllistmodel, blacklistmodel} = require("../Models/Blacklist.model")
require("dotenv").config();


const userRouter = express.Router();


// USER REGISTRATION
userRouter.post("/register",async(req,res)=>{

    const {name,email,password,profession,salary,role} = req.body;

    try {
        const isUserexist = await usermodel.findOne({email});

        if(isUserexist){
            return res.status(400).send({msg:"User Already Exist"})
        }

        bcrypt.hash(password,5,async(err,hash)=>{

            const user = new usermodel({name,email,password:hash,profession,salary,role})

            await user.save()

            res.status(200).send({msg:"Registration Successfull"})

        })


    } catch (error) {
        
        res.status(400).send({msg:error.message})

    }

});




//LOGIN USER
userRouter.post("/login",async(req,res)=>{

    try {
        
        const {email,password} = req.body;

        const isUser = await usermodel.findOne({email})

        if(!isUser){
            return res.staus(400).send({msg:"Please Register first then Login"});
        }

        const isPassword  = await bcrypt.compare(password,isUser.password)

        if(!isPassword){
            return res.staus(400).send({msg:"Please enter correct password"});
        }

        const token = jwt.sign({user_id:isUser._id,role:isUser.role},process.env.JWT_TOKEN_SECRETKEY,{expiresIn:"1m"});

        const ref_token = jwt.sign({user_id:isUser._id,role:isUser.role},process.env.JWT_REFTOKEN_SECRETKEY,{expiresIn:"3m"});

        res.status(200).send({msg:"Lgin Successfully",Token:token,Ref_token:ref_token})

    } catch (error) {
        res.status(400).send({msg:error.message})
    }

})


//Generate New Token
userRouter.get("/getnewtoken",async(req,res)=>{

    const refToken = req.headers.authorization.split(" ")[1];

    if(!refToken){
      return  res.status(400).send({msg:"Login Again"})
    }

    jwt.verify(refToken,process.env.JWT_REFTOKEN_SECRETKEY,async(err,payload)=>{
        
        if(!payload){
            return  res.status(400).send({msg:"Login Again"})
        }else{

            const token = jwt.sign({user_id:isUser._id,role:isUser.role},process.env.JWT_TOKEN_SECRETKEY,{expiresIn:"1m"});

            res.status(200).send({msg:"Login Successfully"})

        }
    })

})




//LOGOUT USING BLACKLISTING
userRouter.post("/logout",async (req,res)=>{

    try {
        const token = req.headers.authorization.split(" ")[1];

        const blacklisttoken = new blacklistmodel({token});

        await blacklisttoken.save();

        res.status("200").send({msg:"Logout Successfully"})

    } catch (error) {
        res.status(400).send({msg:error.message})
    }

})




module.exports = {userRouter}