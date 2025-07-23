import User from "../model/user.schema.js";
import asyncHandler from "../services/asyncHandler.service.js";
import customError from "../services/customError.service.js";
import { generatorFunction } from "../services/passwordGenerator.service.js";

export const changePassword=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {oldPassword,newPassword}=req.body;

    if(!oldPassword || !newPassword) throw new customError("Fill required credentials",422);
    const user=await User.findById(userId).select("+password");
    const isCorrect=await user.comparePassword(oldPassword);
    if(!isCorrect) throw new customError("Wrong password",400);

    user.password=newPassword;
    await user.save({validateBeforeSave:true});

    res.status(200).json({
        success:true,
        message:"Password changed successfully"
    })

})

export const changeMasterPassword=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {oldMasterPassword,newMasterPassword}=req.body;

    if(!oldMasterPassword || !newMasterPassword) throw new customError("Fill required credentials",422);
    const user=await User.findById(userId).select("+masterPassword");
    const isCorrect=await user.compareMasterPassword(oldMasterPassword);
    if(!isCorrect) throw new customError("Wrong master password",400);

    user.masterPassword=newMasterPassword;
    await user.save({validateBeforeSave:true});

    res.status(200).json({
        success:true,
        message:"Master Password changed successfully"
    })

})

export const passwordGeneration=asyncHandler(async(req,res)=>{
    const minLength=Number(req.body.minLength);
    const numLength=Number(req.body.numLength);
    const capLength=Number(req.body.capLength);
    const specialCharLength=Number(req.body.specialCharLength);

    if( Number.isNaN(minLength)||
        Number.isNaN(numLength)||
        Number.isNaN(capLength)||
        Number.isNaN(specialCharLength)) throw new customError("Fill all the fields",422);

    
    let genpassword='';
    try{
        genpassword=generatorFunction({minLength,numLength,capLength,specialCharLength});
    }catch(error){
        const message=error.message;
        throw new customError(`"Error inside catch block"  ${message}`,500);
    }

    console.log("Generated password:", genpassword);


    if(genpassword=='') throw new customError("Error generating password",400);

    res.status(200).json({
        success:true,
        message:"Password generated successfully",
        genpassword
    })
})