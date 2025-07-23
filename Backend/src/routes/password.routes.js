import { Router } from "express";
import { addPassword,getAllPasswords,getPassword,updatePassword,deletePassword } from "../controllers/passwords.controller.js";
import { loginChecker } from "../middlewares/auth.middleware.js";

const router=Router();

router.post('/addpassword/:vaultId',loginChecker,addPassword);
router.get('/getpassword',loginChecker,getPassword);
router.get('/getallpasswords',loginChecker,getAllPasswords);
router.patch('/updatepassword/:vaultId',loginChecker,updatePassword);
router.delete('/deletepassword/:vaultId',loginChecker,deletePassword);

export default router;