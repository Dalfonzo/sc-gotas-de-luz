import { PrismaClient } from '@prisma/client'

export {}

declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient
    }
  }
}
