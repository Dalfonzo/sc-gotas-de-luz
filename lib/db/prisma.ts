/* eslint-disable no-undef */
import { Prisma, PrismaClient } from '@prisma/client'
import { isAfter } from 'date-fns'
import { INVENTORY_RECORD_TYPES } from '~/utils/constants'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const MIDDLEWARES: Prisma.Middleware[] = []
export type DynamicPrismaClient = ReturnType<typeof getNewInstance>
const getNewInstance = () => {
  const instance = new PrismaClient().$extends({
    result: {
      inventoryRecord: {
        expiresInDays: {
          needs: { expirationDate: true, type: true, currentQuantity: true },
          compute(record) {
            if (!record.expirationDate || record.type === INVENTORY_RECORD_TYPES.OUTPUT || !record.currentQuantity) {
              return null
            }
            const today = new Date()
            return isAfter(record.expirationDate, today)
              ? Math.floor((record.expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
              : 0
          },
        },
      },
    },
  })

  return instance
}

let prisma: DynamicPrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = getNewInstance()
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: DynamicPrismaClient
  }
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = getNewInstance()
  }
  prisma = globalWithPrisma.prisma
}

export default prisma
