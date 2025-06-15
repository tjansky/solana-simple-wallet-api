import prisma from "../db/client";

export const getAllWalletAddresses = async () => {
  return prisma.walletAddress.findMany({ orderBy: { createdAt: "desc" } });
};

export const addWalletAddress = async (address: string) => {
  return prisma.walletAddress.upsert({
    where: { address },
    update: {},
    create: { address },
  });
};