import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import prisma from "../db/client";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const SOL_MINT = "So11111111111111111111111111111111111111112";

export const syncBalancesForAllWallets = async () => {
  console.log("🔄 Pokrećem tokenSyncJob...");

  const wallets = await prisma.walletAddress.findMany();

  for (const wallet of wallets) {
    try {
      const pubkey = new PublicKey(wallet.address);

      // --- 1. Get SOL balance
      const lamports = await connection.getBalance(pubkey);
      const solBalance = {
        mint: SOL_MINT,
        amount: lamports / 10 ** 9,
        decimals: 9,
      };

      // --- 2. Get SPL tokens
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      });

      const tokens = tokenAccounts.value.map((acc) => {
        const info = acc.account.data.parsed.info;
        return {
          mint: info.mint,
          amount: Number(info.tokenAmount.uiAmount),
          decimals: info.tokenAmount.decimals,
        };
      });

      const allBalances = [solBalance, ...tokens];

      // --- 3. Delete old balance data
      await prisma.tokenBalance.deleteMany({
        where: { walletId: wallet.id },
      });

      // --- 4. Save new balance data
      for (const token of allBalances) {
        await prisma.tokenBalance.create({
          data: {
            walletId: wallet.id,
            mint: token.mint,
            amount: token.amount,
            decimals: token.decimals,
          },
        });
      }

      console.log(`Sync for ${wallet.address} (${allBalances.length} tokens)`);
    } catch (err) {
      console.error(`Error on ${wallet.address}:`, err);
    }
  }

  console.log("tokenSyncJob done.");
};