import asyncHandler from "./asyncHandler.service.js";
import customError from "./customError.service.js";
import crypto from "crypto";

function getRandomChar(charSet){
    const i=crypto.randomInt(0,charSet.length);
    return charSet[i];
}

export const generatorFunction=({minLength,numLength,capLength,specialCharLength})=>{
    const sum=numLength+capLength+specialCharLength;
    if(minLength<=sum) throw new customError("Minimum length must be greater than the summation of other mentioned lengths",422);

    const num='0123456789';
    const cap='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const special='!@#$%^&*!~{}[]()+_=-.,?/"';
    const chars='abcdefghijklmnopqrstuvwxyz';

    const passwordChars=[]

    while(numLength>0){
        passwordChars.push(getRandomChar(num));
        numLength--;
    }

    while(capLength>0){
        passwordChars.push(getRandomChar(cap))
        capLength--;
    }

    while(specialCharLength>0){
        passwordChars.push(getRandomChar(special))
        specialCharLength--;
    }

    while(minLength-sum>0){
        passwordChars.push(getRandomChar(chars))
        minLength--;
    }

    let i=passwordChars.length-1;
    while(i>=0){
        let j=crypto.randomInt(0,i+1);
        const temp=passwordChars[j];
        passwordChars[j]=passwordChars[i];
        passwordChars[i]=temp;

        i--;
    }

    const password=passwordChars.join('')

    return password;

}