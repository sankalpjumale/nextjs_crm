import "server-only"
import { auth } from "@clerk/nextjs/server"
import type { AccessTokenProvider } from "../supabase/user-client"

//supplies clerk session token supabase, no template name default token is supported method, return null when nobody is sign in
export const getClerkAccessToken: AccessTokenProvider = async () => {
    const { getToken } = await auth()
    return getToken()
}