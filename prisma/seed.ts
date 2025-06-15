import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const wallet = await prisma.walletAddress.upsert({
    where: { address: "DemoWallet11111111111111111111111111111111" },
    update: {},
    create: {
      address: "DemoWallet11111111111111111111111111111111",
    },
  });

  // Token metadata
  await prisma.tokenMetadata.createMany({
    data: [
      {
        mint: "So11111111111111111111111111111111111111112",
        symbol: "SOL",
        name: "Solana",
        decimals: 9,
        logoURI: "https://cryptologos.cc/logos/solana-sol-logo.png"
      },
      {
        mint: "Es9vMFrzaCER6Nd3p8vJUonWnPr5ffrN9PJ2EM3p6wBw", // USDT
        symbol: "USDT",
        name: "Tether USD",
        decimals: 6,
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png"
      }
    ]
  });

  // Token prices
  await prisma.tokenPrice.createMany({
    data: [
      {
        mint: "So11111111111111111111111111111111111111112",
        usd: 155.12,
        updatedAt: new Date()
      },
      {
        mint: "Es9vMFrzaCER6Nd3p8vJUonWnPr5ffrN9PJ2EM3p6wBw",
        usd: 1.0,
        updatedAt: new Date()
      }
    ]
  });

  // Token balances
  await prisma.tokenBalance.createMany({
    data: [
      {
        walletId: wallet.id,
        mint: "So11111111111111111111111111111111111111112",
        amount: 0.42,
        decimals: 9
      },
      {
        walletId: wallet.id,
        mint: "Es9vMFrzaCER6Nd3p8vJUonWnPr5ffrN9PJ2EM3p6wBw",
        amount: 15.5,
        decimals: 6
      }
    ]
  });

  console.log("✅ Seed completed.");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });