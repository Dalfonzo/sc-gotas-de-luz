import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  /* Roles */
  const adminRole = await prisma.roles.create({
    data: { name: 'admin' },
  })

  const resources = ['news', 'roles', 'users']
  // TODO:  Probar estos seeds luego
  await Promise.all(
    resources.map(async (resource) => {
      return await prisma.permissions.create({
        data: {
          create: true,
          update: true,
          delete: true,
          read: true,
          roles: { connect: { id: adminRole.id } },
          resources: { create: { name: resource } },
        },
      })
    })
  )

  await prisma.users.create({
    data: {
      name: 'admin',
      password: await bcrypt.hash('123456', 10),
      lastName: 'admin',
      email: 'admin@gmail.com',
      roles: { connect: { id: adminRole.id } },
    },
  })
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
