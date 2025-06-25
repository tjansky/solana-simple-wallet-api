import cron from "node-cron";
import prisma from "../db/client";
import { walletQueue } from "../queues/walletQueue";
import { priceQueue } from "../queues/priceQueue";

// cron.schedule("*/2 * * * *", async () => {
//   const wallets = await prisma.walletAddress.findMany();
//   for (const w of wallets) {
//     await walletQueue.add("sync", { id: w.id, address: w.address });
//   }
//   console.log(`Queued ${wallets.length} wallet jobs`);
// });

cron.schedule("*/2 * * * *", async () => {
  const tokenMints = await prisma.tokenBalance.findMany({
    distinct: ["mint"],
    select: { mint: true },
  });

  for (const t of tokenMints) {
    await priceQueue.add("sync", { mint: t.mint });
  }

  console.log(`Queued ${tokenMints.length} price jobs`);
});