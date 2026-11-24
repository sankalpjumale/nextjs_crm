import "server-only"
import { ROUTES } from "@/config/routes";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { requireUserId } from "./require-user";


export type TenantContext = {
    userId: string;
    orgId: string
}

/**
 * first line of every tenant scoped page, layout, server action and read
 * 1.auth.protect(): signed out -> redirect(page) / 401 9action
 * 2. no active organization -> /select-organization
 */

export async function requireTenantContext(): Promise<TenantContext> {
    const { userId, orgId } = await auth.protect()
    
    if (!orgId) {
        redirect(ROUTES.selectOrganization)
    }

    return {userId, orgId}
}