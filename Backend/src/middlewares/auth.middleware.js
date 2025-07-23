import User from "../model/user.schema.js";
import asyncHandler from "../services/asyncHandler.service.js";
import JWT from "jsonwebtoken";
import customError from "../services/customError.service.js";
import config from "../config/index.config.js";

export const loginChecker=asyncHandler(async(req,res,next)=>{
    let token;
    if(req.cookies.token || req.headers.authorization?.startsWith("Bearer"))
        { token= req.cookies.token || req.headers.authorization.split(" ")[1];}

    if(!token) throw new customError("Authorization not granted",403);

    try{
        const decodedJWTpayload=JWT.verify(token,config.JWT_SECRET_KEY);
        req.user=await User.findById(decodedJWTpayload._id,"name email");
        next()
    }
    catch(error){
        throw new customError("Unauthorized",403);
    }
})