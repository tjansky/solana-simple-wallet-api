import { Router } from "express";
import * as walletController from "../controllers/walletController";

const router = Router();

router.get("/", walletController.getAllWallets);
router.post("/", walletController.addWallet);

router.get("/:address/balances", walletController.getWalletBalances);

export default router;