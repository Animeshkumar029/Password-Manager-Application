import mongoose from "mongoose";
import vaultTypes from "../utils/vaultTypes.util.js";
import { encryptFunction } from "../services/encryptDecrypt.service.js";

const passwordSchema=new mongoose.Schema({
    siteName:{
        type:String,
        required:true
    },
    siteURL:{
        type:String,
        required:true
    },
    loginUsername:{
        type:String
    },
    encryptedPassword:{
        type:String,
        required:true
    },
    isEncrypted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const vaultSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    vaultName:{
        type:String,
        required:true
    },
    vaultType:{
        type:String,
        enum:Object.values(vaultTypes),
        required:true
    },
    entries:{
        type:[passwordSchema],
        default:[]
    }
    
},{timestamps:true})


vaultSchema.pre('save',function(next){
    this.entries.forEach((entry)=>{
        if(!entry.isEncrypted){
            entry.encryptedPassword=encryptFunction(entry.encryptedPassword);
            entry.isEncrypted=true;
        } 
    })
    next();
});

export default mongoose.model('Vault',vaultSchema);