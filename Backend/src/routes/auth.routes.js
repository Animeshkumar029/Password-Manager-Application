import { Router } from "express";
import { signUp,logIn,logOut } from "../controllers/auth.controller.js";
import { loginChecker } from "../middlewares/auth.middleware.js";

const router=Router();

router.post('/signup',signUp);
router.post('/logIn',logIn);
router.get('/logOut',loginChecker,logOut);


export default router;

