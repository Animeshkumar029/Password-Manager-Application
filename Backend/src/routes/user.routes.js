import { Router } from "express";
import { changePassword,changeMasterPassword,passwordGeneration } from "../controllers/user.controller.js";
import { loginChecker } from "../middlewares/auth.middleware.js";


const router=Router();

router.post('/changepassword',loginChecker,changePassword);
router.post('/changemasterpassword',loginChecker,changeMasterPassword);
router.post('/passwordgenerate',loginChecker,passwordGeneration);

export default router;


