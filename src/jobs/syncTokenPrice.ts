import prisma from "../db/client";
import axios from "axios";

export const syncTokenPrice = async (mint: string) => {
  const apiKey = process.env.BIRDEYE_API_KEY!;
  const url = `https://public-api.birdeye.so/defi/price?address=${mint}`;

  const res = await axios.get(url, {
    headers: { 
      "X-API-KEY": apiKey },
  });

  let usd = res.data.data?.value;
  if (!usd) {
    // log it
    usd = 0;
  }

  await prisma.tokenPrice.upsert({
    where: { mint },
    update: { usd },
    create: { mint, usd },
  });

  console.log(`Synced price for ${mint}: $${usd.toFixed(4)}`);
};