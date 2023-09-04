import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { BASE_CATEGORIES, RESOURCES } from '../utils/constants'
const prisma = new PrismaClient()

async function main() {
  /* Roles */
  const adminRole = await prisma.roles.create({
    data: { name: 'administrador', description: 'Provee acceso a todo el sistema', canBeDeleted: false },
  })

  const resources = Object.values(RESOURCES)

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
      canBeDeleted: false,
      roles: { connect: { id: adminRole.id } },
    },
  })

  await prisma.category.createMany({ data: BASE_CATEGORIES })
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
