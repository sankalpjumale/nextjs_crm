import "server-only"
import { clientEnv } from "@/config/env.client"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


export async function requireUserId(): Promise<string> {
    const { userId } = await auth()
    
    if (!userId) {
        redirect(clientEnv.NEXT_PUBLIC_CLERK_SIGN_IN_URL)
    }

    return userId
}