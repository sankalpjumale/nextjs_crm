import "server-only"
import { createClient } from "@supabase/supabase-js"
import { clientEnv } from "@/config/env.client"
import { serverEnv } from "@/config/env.server"
import type { Database } from "@/types/database.types"


//create supabase client with admin power, secret key bypasses rls, so use it in only in trusted server code (api routes, server actions, crom jobs)
export function createAdminClient() {
    return createClient<Database>(
        clientEnv.NEXT_PUBLIC_SUPABASE_URL,
        serverEnv.SUPABASE_SECRET_KEY, //secret admin key never send to browser
        {
            auth: {
                persistSession: false, //do not store session
                autoRefreshToken: false, //do not refresh token automatically
                detectSessionInUrl: false //do not look for login token in url
            }
        }
    )
}