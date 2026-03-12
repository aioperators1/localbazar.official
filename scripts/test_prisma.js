const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({ include: { category: true } });
    console.log("Products found:", products.length);
  } catch (e) {
    console.error("Prisma error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
