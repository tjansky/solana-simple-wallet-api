import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { connection } from "../queues/walletQueue";
import { syncBalanceForWallet } from "../jobs/syncBalanceForWallet";

new Worker(
  "wallet-sync",
  async (job) => {
    console.log("👷‍♂️ Worker started: wallet-sync");
    const id = job.data.id;
    const address = job.data.address;
    if (!address) throw new Error("Missing address");
    await syncBalanceForWallet(id, address);
  },
  { connection, concurrency: 3 }
);