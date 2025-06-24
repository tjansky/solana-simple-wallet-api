import { Worker } from "bullmq";
import { connection } from "../queues/walletQueue";
import { syncTokenPrice } from "../jobs/syncTokenPrice";

new Worker(
  "price-sync",
  async (job) => {
    const mint = job.data.mint;
    if (!mint) throw new Error("Missing mint");
    await syncTokenPrice(mint);
  },
  { connection, concurrency: 5 }
);