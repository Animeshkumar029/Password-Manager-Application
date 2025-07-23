import User from "../model/user.schema.js";
import asyncHandler from "../services/asyncHandler.service.js";
import customError from "../services/customError.service.js";
import {cookieOptions,logOutCookieOptions} from "../utils/cookieOptions.util.js";


export const signUp=asyncHandler(async(req,res)=>{
    const {name,password,email}=req.body;
    if(!name||!password||!email) throw new customError("Fill required credentials",422);

    const isPresent=await User.findOne({email});
    if(isPresent) throw new customError("email already registered",403);

    const user=await User.create({
        name,
        password,
        email
    })

    const token=await user.getJWT();

    res.cookie('token',token,cookieOptions);
    user.password=undefined;

    res.status(200).json({
        success:true,
        message:"User registerd successfully",
        user,
        token
    })
})

export const logIn=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password) throw new customError("Login credentials are absent",422);

    const user=await User.findOne({email}).select("+password");
    if(!user) throw new customError("User does not exist",404);

    const isCorrect=await user.comparePassword(password);
    if(!isCorrect) throw new customError("Wrong password",403);

    const token=await user.getJWT();
    res.cookie('token',token,cookieOptions);

    user.password=undefined;

    res.status(200).json({
        success:true,
        message:"Logged In successfully",
        user,
        token
    })
})

export const logOut=asyncHandler(async(_req,res)=>{
    res.cookie('token',null,logOutCookieOptions);

    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })


})