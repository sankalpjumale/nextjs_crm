import "server-only"
//supabase lib to talk to db
import { createClient } from "@supabase/supabase-js"
import { clientEnv } from "@/config/env.client"
//auto generated types of db tables (give autocomplete  + type safety)
import type { Database } from "@/types/database.types"

//return user access token jwt, if not log in then return null
export type AccessTokenProvider = () => Promise<string | null>

//create supabase client tha act as log in user not as admin rls rules are respected
export function createUserClient(getAccessToken: AccessTokenProvider) {
    return createClient<Database>(
        clientEnv.NEXT_PUBLIC_SUPABASE_URL,
        clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {accessToken: getAccessToken} //on every request fetch user token and attach it
    )
}

export type AppSupabaseClient = ReturnType<typeof createUserClient>