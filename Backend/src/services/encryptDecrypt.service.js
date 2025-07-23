import crypto from "crypto"
import config from "../config/index.config.js";

const ivLength=16;
const algo='aes-256-cbc';
const key=config.VAULT_SECRET;

export const encryptFunction=(text)=>{
    const iv=crypto.randomBytes(ivLength);
    const cipher=crypto.createCipheriv(algo,Buffer.from(key),iv);
    let encrypted=cipher.update(text);
    encrypted=Buffer.concat([encrypted,cipher.final()]);
    return iv.toString('hex')+':'+encrypted.toString('hex');
}

export const decryptFunction=(encryptedText)=>{
    const textParts= encryptedText.split(':');
    const iv=Buffer.from(textParts.shift(),'hex');
    const encrypted=Buffer.from(textParts.join(':'),'hex');
    const decipher=crypto.createDecipheriv(algo,Buffer.from(key),iv);
    let decrypted=decipher.update(encrypted);
    decrypted=Buffer.concat([decrypted,decipher.final()]);
    return decrypted.toString();
}
