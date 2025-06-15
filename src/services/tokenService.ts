import prisma from "../db/client";

export const getTokenBalancesForAddress = async (address: string) => {
  const wallet = await prisma.walletAddress.findUnique({
    where: { address },
    include: { balances: true }
  });

  if (!wallet) throw new Error("Wallet not found");

  // Todo - no need to fetch all prices and metadata
  const prices = await prisma.tokenPrice.findMany();
  const metadata = await prisma.tokenMetadata.findMany();

  return wallet.balances.map(balance => {
    const meta = metadata.find(m => m.mint === balance.mint);
    const price = prices.find(p => p.mint === balance.mint)?.usd ?? 0;
    const value = balance.amount * price;

    return {
      mint: balance.mint,
      amount: balance.amount,
      symbol: meta?.symbol ?? "UNKNOWN",
      name: meta?.name ?? "",
      logoURI: meta?.logoURI ?? "",
      price,
      value
    };
  });
};