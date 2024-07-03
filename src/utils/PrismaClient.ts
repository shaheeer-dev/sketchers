import { PrismaClient } from '@prisma/client'

let dbInstance: PrismaClient | undefined

export const getDbInstance = () => {
  if(!dbInstance) {
    dbInstance = new PrismaClient
  }

  return dbInstance
}

export default getDbInstance()
