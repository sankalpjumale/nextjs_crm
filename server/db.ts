import "server-only"
import { serverEnv } from "@/config/env.server"
import {PrismaClient} from "@prisma/client"



const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = 
    globalForPrisma.prisma ??
    new PrismaClient({
        log: serverEnv.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    })

if (serverEnv.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}