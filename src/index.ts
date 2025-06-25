import express from "express";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { walletQueue } from "./queues/walletQueue";
import dotenv from "dotenv";
import walletRoutes from "./routes/walletRoutes";
// import './cron/scheduler' - commented so cron does not auto start

dotenv.config();

const app = express();
app.use(express.json());

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(walletQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.use("/wallets", walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});