import "server-only"
import { getClerkAccessToken } from "../auth/access-token"
import { createUserClient } from "./user-client"

//client the app uses for almost everything: acts as sign in user, so rls applies. create one per request and pass it into services.
export function createCurrentUserClient() {
    return createUserClient(getClerkAccessToken)
}