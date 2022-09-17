import { PrismaClient } from '@prisma/client'
import prisma from './prisma'

export class DbService {
  db: PrismaClient
  constructor() {
    this.db = prisma
  }
}
