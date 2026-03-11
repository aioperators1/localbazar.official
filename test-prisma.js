const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.order.aggregate({ _sum: { total: true } })
    .then(res => console.log('Result:', res))
    .catch(err => console.error('Error:', err))
    .finally(() => prisma.$disconnect());
