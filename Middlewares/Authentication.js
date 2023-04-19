const jwt = require("jsonwebtoken");

const {usermodel} = require("../Models/User.model");

const authMiddleware = async(req,res,next)=>{

    try {
        
        const token  = req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(400).send({msg:"Login Again"})
        }

        const checkToken  = jwt.verify(token,process.env.JWT_TOKEN_SECRETKEY)

        const {user_id,role} = checkToken

        const user = await usermodel.findOne({user_id})

        if(!user){
            return res.status(400).send({msg:"User not found"})
        }

        req.user = user
        next();
    } catch (error) {
        return res.status(400).send({msg:"Login Again"})
    }

}



module.exports = {authMiddleware}