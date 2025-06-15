import { Worker } from "bullmq";
import { connection } from "../queues/tokenQueue";
import { syncBalancesForAllWallets } from "../jobs/tokenSyncJob";

new Worker(
  "token-sync",
  async () => {
    console.log("Worker: Starting syncBalancesForAllWallets...");
    await syncBalancesForAllWallets();
  },
  { connection }
);