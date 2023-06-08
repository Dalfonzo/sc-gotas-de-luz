/* eslint-disable no-undef */
import { Prisma, PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const MIDDLEWARES: Prisma.Middleware[] = []

const getNewInstance = (): PrismaClient => {
  const instance = new PrismaClient()
  MIDDLEWARES.forEach((middleware) => instance.$use(middleware))
  return instance
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = getNewInstance()
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient
  }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = getNewInstance()
  }
  prisma = globalWithPrisma.prisma
}

export default prisma
