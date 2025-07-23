import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import vaultRouter from "./routes/vault.routes.js";
import passwordRouter from "./routes/password.routes.js";

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());

app.get('/',(_req,res)=>{
    console.log("🚀App Started");
    res.send("App Started");
})

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/vault',vaultRouter);
app.use('/api/v1/vault/password',passwordRouter);

export default app;