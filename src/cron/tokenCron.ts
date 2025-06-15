import cron from "node-cron";
import { tokenQueue } from "../queues/tokenQueue";

cron.schedule("*/2 * * * *", async () => {
  console.log("Cron: sending job in queue...");
  await tokenQueue.add("sync", {});
});
