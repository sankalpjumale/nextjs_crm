import "server-only"
import { ROUTES } from "@/config/routes";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { requireUserId } from "./require-user";


export type TenantContext = {
    userId: string;
    orgId: string
}

//call this at start of every server action and every tenant-scoped read
//org id comes only from the verified session, never from client input

export async function requireTenantContext(): Promise<TenantContext> {
    const { userId, orgId } = await auth.protect()
    
    if (!orgId) {
        redirect(ROUTES.selectOrganization)
    }

    return {userId, orgId}
}