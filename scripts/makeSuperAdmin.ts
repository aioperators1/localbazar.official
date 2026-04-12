import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.user.updateMany({
        where: {
            username: 'admin'
        },
        data: {
            role: 'SUPER_ADMIN'
        }
    })
    console.log("Updated 'admin' account to SUPER_ADMIN.")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
