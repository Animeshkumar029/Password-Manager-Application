import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import JWT from "jsonwebtoken";
import config from "../config/index.config.js";


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    masterPassword:{
        type:String,
    },
    emailToken: String,
    emailTokenExpiry: Date
},{timestamps:true})

userSchema.pre('save',async function(next){

    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12)
    }

    if(!this.masterPassword){
        this.masterPassword=this.password;
    }
    else if(this.isModified('masterPassword')){
        this.masterPassword=await bcrypt.hash(this.masterPassword,12);
    }

    next();
})

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.compareMasterPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.masterPassword);
}

userSchema.methods.getJWT=function(){
    return JWT.sign({_id:this._id},config.JWT_SECRET_KEY,{expiresIn:config.JWT_EXPIRY})
}

userSchema.methods.generateToken=function(){
    const token=crypto.randomBytes(10).toString('hex');

    const hashedToken=crypto.createHash('sha256').update(token).digest('hex');
    this.emailToken=hashedToken;

    this.emailTokenExpiry=Date.now()+10*60*1000;

    return token;
}

// userSchema.methods.toJSON=function(){
//     const obj=this.toObject();
//     delete obj.password,
//     delete obj.masterPassword,
//     delete obj.emailToken,
//     delete obj.emailTokenExpiry

//     return obj;
// }

export default mongoose.model('User',userSchema);
