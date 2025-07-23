import app from "./src/app.js";
import mongoose from "mongoose";
import config from "./src/config/index.config.js";

(async()=>{
    try{
        await mongoose.connect(config.MONGO_URL);
        console.log('✅ DB CONNECTED!');

        const server=app.listen(config.PORT,()=>{
            console.log(`App is listening on port ${config.PORT}`);
        });

        server.on('error',(error)=>{
            console.log("Error starting the server -->",error);
            process.exit(1);
        })
    }catch(error){
        console.log("Error ==> ",error);
        throw error;
    }
})()