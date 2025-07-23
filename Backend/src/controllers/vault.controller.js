import Vault from "../model/vault.schema.js";
import User from "../model/user.schema.js";
import asyncHandler from "../services/asyncHandler.service.js";
import customError from "../services/customError.service.js";
import vaultTypes from "../utils/vaultTypes.util.js";

export const createVault=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {vaultName,vaultType}=req.body;

    if(!userId || !vaultName?.trim() || !vaultType) throw new customError("Fill all required credentials to create a new Vault",422);
    
    if(!Object.values(vaultTypes).includes(vaultType)) throw new customError("Choose a valid vault type",422);

    const vault=await Vault.create({
        userId,
        vaultName,
        vaultType
    })

    res.status(200).json({
        success:true,
        message: `New vault created successfully`,
        vault
    })
})

export const viewVault=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const vaultName=req.body.vaultName?.trim();
    const {vaultId}=req.params;

    if(!vaultId && !vaultName) throw new customError("provide vault name or vaultID",422);
    let vault;

    if(vaultId){
        vault=await Vault.findOne({_id:vaultId,userId:userId});
    }
    else{
        vault=await Vault.findOne({userId,vaultName});
    }
    if(!vault) throw new customError("Either the vault does not exist or you are not its owner",400);

    res.status(200).json({
        success:true,
        message:"Successfully fetched the required vault",
        vault
    })
})

export const getAllVaults=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const vaults=await Vault.find({userId});
    if(vaults.length===0) throw new customError("User does not have any vault",422);
    res.status(200).json({
        success:true,
        message:"Vaults fetched successfully",
        vaults
    })
})

export const updateVault=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {newName,vaultName,vaultType,masterPassword}=req.body;
    const vaultID=req.params.vaultID

    if(!newName && !vaultType) throw new customError("NO feild provided for updation",422);
    if(!vaultID && !vaultName) throw new customError("Fill necessary credentials",422);
    if(!masterPassword) throw new customError("Master password required",422);
    const user=await User.findById(userId);

    if(newName!=null){const ifExist=await Vault.findOne({userId,vaultName:newName});
    if(ifExist) throw new customError("This vault name is already under user",409);}
    if(vaultType!=null && !Object.values(vaultTypes).includes(vaultType)) throw new customError("Provide a valid vault type for updation",422);

    let vault;
    if(!vaultID) vault=await Vault.findOne({userId,vaultName});
    else vault=await Vault.findOne({userId,_id:vaultID});

    if(!vault) throw new customError("Either the vault does not exist or you are not the owner of it",403);

    const isCorrect=await user.compareMasterPassword(masterPassword);
    if(!isCorrect) throw new customError("Wrong master password",403);

    if(newName!=null) vault.vaultName=newName;
    if(vaultType!=null) vault.vaultType=vaultType;
    await vault.save({validateBeforeSave:true});

    res.status(200).json({
        success:true,
        message:"Vault updated successfully",
        vault
    })
})

export const deleteVault=asyncHandler(async(req,res)=>{
    const {vaultId}=req.params;
    const userId=req.user._id;
    const masterPassword=req.body.masterPassword;

    if(!vaultId || !masterPassword) throw new customError("Fill required credentials for deleting a vault",422);
    const user=await User.findById(userId);

    const isCorrect=await user.compareMasterPassword(masterPassword);
    if(!isCorrect) throw new customError("Wrong master password",403);

    const toDelete=await Vault.findOneAndDelete({_id:vaultId,userId:userId});
    if(!toDelete) throw new customError("Either the vault does not exist or you are not authorized to delete it",400);

    res.status(200).json({
        success:true,
        message:"Vault deleted successfully"
    })
})

