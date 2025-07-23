import Vault from "../model/vault.schema.js";
import User from "../model/user.schema.js";
import asyncHandler from "../services/asyncHandler.service.js";
import customError from "../services/customError.service.js";
import { decryptFunction } from "../services/encryptDecrypt.service.js";


export const addPassword=asyncHandler(async(req,res)=>{
    const password=req.body.password;
    const siteName=req.body.siteName;
    const siteURL=req.body.siteURL;
    const loginUsername = req.body.loginUsername;
    const masterPassword=req.body.masterPassword;
    const vaultName=req.body.vaultName;
    const vaultId=req.params.vaultId;
    const userId=req.user._id;

    if(!vaultId && !vaultName) throw new customError("vault name or vaultId is needed",422);
    if(!siteName || !siteURL) throw new customError("Fill all credentials",422);
    if(!password) throw new customError("Password to saved is not provided",422);
    if(!masterPassword) throw new customError("Provide the master password to save password in vault",422);

    let vault;
    if(vaultId) vault=await Vault.findOne({_id:vaultId,userId:userId});
    else vault=await Vault.findOne({vaultName:vaultName,userId:userId})
    if(!vault) throw new customError("Either the vault credentials are wrong or you are not the owner of this vault",400);

    const user=await User.findById(userId);
    const isCorrect=await user.compareMasterPassword(masterPassword);
    if(!isCorrect) throw new customError("Wrong master password",400);

    vault.entries.push({
        siteName:siteName,
        siteURL:siteURL,
        loginUsername:loginUsername,
        encryptedPassword:password
    })

    await vault.save({validateBeforeSave:true});

    res.status(200).json({
        success:true,
        message:"Password saved successfully"
    })

})

export const getPassword=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {masterPassword,siteName,siteURL,vaultName}=req.body;
    const {vaultId}=req.params;

    if(!vaultName && !vaultId) throw new customError("Either vaultId or Vault name must be provided",422);
    if(!masterPassword || !siteName || !siteURL ) throw new customError("Fill necessary credentials",422);

    const user=await User.findById(userId);
    let vault;
    if(vaultId) vault=await Vault.findOne({_id:vaultId,userId:userId});
    else vault=await Vault.findOne({vaultName:vaultName,userId:userId})
    if(!vault) throw new customError("Either the vault credentials are wrong or you are not the owner of this vault",400);

    const isCorrect=await user.compareMasterPassword(masterPassword);
    if(!isCorrect) throw new customError("Wrong master password",400);
    
    const password=vault.entries.find((e) => e.siteName === siteName && e.siteURL === siteURL);
    if(!password) throw new customError("No such entry exists",400);
    const decryptedPassword=decryptFunction(password.encryptedPassword);

    res.status(200).json({
        success:true,
        message:"Successfully fetched the required password",
        decryptedPassword
    })
})

export const getAllPasswords=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {vaultName,masterPassword}=req.body;
    const {vaultId}=req.params;

    if(!vaultName && !vaultId) throw new customError("Neither vault name nor ID  is present",422);
    if(!masterPassword) throw new customError("Master password is required",422);

    const user=await User.findById(userId);
    const isCorrect= await user.compareMasterPassword(masterPassword);
    if(!isCorrect) throw new customError("Wrong master password",403);

    let vault;
    if(!vaultId) vault=await Vault.findOne({userId,vaultName});
    else vault=await Vault.findOne({userId,_id:vaultId});
    if(!vault) throw new customError("Either vault does not exist or you are not its owner",403);

    const passwords= vault.entries;
    
    res.status(200).json({
        success:true,
        message:"Passwords fetched successfully",
        passwords
    })

})

export const updatePassword=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {siteName,siteURL,newPassword,vaultName,masterPassword}=req.body;
    const vaultId=req.params.vaultID;

    if(!vaultName && !vaultId) throw new customError("vault details are missing",422);
    if(!siteName || !siteURL) throw new customError("Provide necessary credentials for updating password",422);
    if(!masterPassword) throw new customError("Master password is required for performing this operation",422);

    let vault;
    if(!vaultId) vault=await Vault.findOne({userId,vaultName});
    else vault=await Vault.findOne({userId,_id:vaultId});

    if(!vault) throw new customError("Either vault is not present you are not the owner of it",422);

    const user=await User.findById(userId);
    const isCorrect=await user.compareMasterPassword(masterPassword);
    if(!isCorrect) throw new customError("Wrong master password",403);

    const entry=vault.entries.find(entry=>entry.siteURL===siteURL && entry.siteName===siteName)

    if(!entry) throw new customError("No such entry exists",404);
    entry.encryptedPassword=newPassword
    entry.isEncrypted=false

    await vault.save({validateBeforeSave:true});

    res.status(200).json({
        success:true,
        message:"Successfully updated the required password"
    })
})

export const deletePassword=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {masterPassword,siteName,siteURL,vaultName}=req.body;
    const {vaultId}=req.params;

    if(!vaultName && !vaultId) throw new customError("Either vaultId or Vault name must be provided",422);
    if(!masterPassword || !siteName || !siteURL ) throw new customError("Fill necessary credentials",422);

    const user=await User.findById(userId);
    let vault;
    if(vaultId) vault=await Vault.findOne({_id:vaultId,userId:userId});
    else vault=await Vault.findOne({vaultName:vaultName,userId:userId})
    if(!vault) throw new customError("Either the vault credentials are wrong or you are not the owner of this vault",400);

    const isCorrect=await user.compareMasterPassword(masterPassword);
    if(!isCorrect) throw new customError("Wrong master password",400);

    const originalLength = vault.entries.length;

    vault.entries = vault.entries.filter(
        (e) => !(e.siteName === siteName && e.siteURL === siteURL)
    );

    if (vault.entries.length === originalLength) {
        throw new customError("No such entry exists", 404);
    }

    await vault.save({ validateBeforeSave: true });

    res.status(200).json({
        success:true,
        message:"Successfully delete the password"
    })
})