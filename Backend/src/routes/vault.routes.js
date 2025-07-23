import { Router } from "express";
import { loginChecker } from "../middlewares/auth.middleware.js";
import { createVault,getAllVaults,viewVault,deleteVault,updateVault } from "../controllers/vault.controller.js";

const router=Router();

router.post('/createvault',loginChecker,createVault);
router.get('/viewvault/:vaultId',viewVault);                       // optional parameter pass causing problem
router.get('/getallvaults',loginChecker,getAllVaults);
router.patch('/updatevault',loginChecker,updateVault);             // optional parameter pass causing problem
router.delete('/deletevault/:vaultId',loginChecker,deleteVault);

export default router;