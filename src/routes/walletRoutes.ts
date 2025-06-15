import { Router } from "express";
import * as walletController from "../controllers/walletController";

const router = Router();

router.get("/", walletController.getAllWallets);
router.post("/", walletController.addWallet);

export default router;