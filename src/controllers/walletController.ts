import { Request, Response } from "express";
import * as walletService from "../services/walletService";

export const getAllWallets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const wallets = await walletService.getAllWalletAddresses();
    res.status(200).json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wallets" });
  }
};

export const addWallet = async (req: Request, res: Response): Promise<void> => {
  const { address } = req.body;

  if (!address || typeof address !== "string") {
    res.status(400).json({ error: "Address is required" });
    return;
  }

  try {
    const wallet = await walletService.addWalletAddress(address);
    res.status(201).json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add wallet" });
  }
};