import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.network.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      network: "regtest",
      uri: "https://blockstream-electrs-api.regnet.btc.eastlayer.io",
      explorer: "https://explorer.regnet.btc.eastlayer.io",
      regbox: "https://regbox.regnet.btc.eastlayer.io",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
