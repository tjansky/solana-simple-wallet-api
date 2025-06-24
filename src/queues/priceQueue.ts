import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const priceQueue = new Queue("price-sync", {
  connection,
});