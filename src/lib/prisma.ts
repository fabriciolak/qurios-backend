import { PrismaClient } from '@prisma/client'
import { env } from 'process'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query'] : [],
})
