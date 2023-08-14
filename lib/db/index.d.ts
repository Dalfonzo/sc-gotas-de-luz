import { DynamicPrismaClient } from './prisma'

export {}

declare global {
  namespace NodeJS {
    interface Global {
      prisma?: DynamicPrismaClient
    }
  }
}
