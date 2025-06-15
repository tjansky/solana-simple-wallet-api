import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // ← KLJUČNA LINIJA
});

export const tokenQueue = new Queue("token-sync", {
  connection,
});