import express from "express";
import dotenv from "dotenv";
import walletRoutes from "./routes/walletRoutes";
// import './cron/scheduler' - commented so cron does not auto start

dotenv.config();

const app = express();
app.use(express.json());

app.use("/wallets", walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});