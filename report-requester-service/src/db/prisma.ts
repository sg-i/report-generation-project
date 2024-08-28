import {PrismaClient} from '@prisma/client'
import { dbInit } from './init'

const prisma = new PrismaClient()

dbInit(prisma).then(()=>{
    console.log("DB was initialized")
}).catch((e)=>{
    console.log('Error inserting data:', e)
})

export default prisma;