import { Connection, PublicKey } from "@solana/web3.js";
import prisma from "../db/client";

const connection = new Connection(process.env.SOLANA_RPC_URL!, "confirmed");

export const syncBalanceForWallet = async (id: string, address: string) => {
  console.log(`Sync started for wallet ${address}`);

  const pubkey = new PublicKey(address);

  // 1. Sync native SOL balance
  let sol = 0;
  try {
    const solLamports = await connection.getBalance(pubkey);
    sol = solLamports / 1e9;

    const existingSol = await prisma.tokenBalance.findFirst({
      where: { walletId: id, mint: "SOL" },
    });

    if (existingSol) {
      await prisma.tokenBalance.update({
        where: { id: existingSol.id },
        data: { amount: sol, decimals: 9 },
      });
    } else {
      await prisma.tokenBalance.create({
        data: {
          walletId: id,
          mint: "SOL",
          amount: sol,
          decimals: 9,
        },
      });
    }
  } catch (err: any) {
    console.error(`Failed to sync SOL for ${address}:`, err.message);
  }

  // 2. Sync SPL tokens
  try {
    const tokens = await connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    for (const { account } of tokens.value) {
      const info = account.data.parsed.info;
      const mint = info.mint;
      const amount = parseFloat(info.tokenAmount.amount);
      const decimals = info.tokenAmount.decimals;
      const normalized = amount / 10 ** decimals;

      const existingToken = await prisma.tokenBalance.findFirst({
        where: { walletId: id, mint },
      });

      if (existingToken) {
        await prisma.tokenBalance.update({
          where: { id: existingToken.id },
          data: {
            amount: normalized,
            decimals,
          },
        });
      } else {
        await prisma.tokenBalance.create({
          data: {
            walletId: id,
            mint,
            amount: normalized,
            decimals,
          },
        });
      }
    }
  } catch (err: any) {
    console.error(`Failed to sync SPL tokens for ${address}:`, err.message);
  }

  console.log(`Wallet sync complete: ${address}`);
};
