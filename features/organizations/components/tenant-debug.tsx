import { requireTenantContext } from "@/server/auth/require-tenant-context";
import { createCurrentUserClient } from "@/server/supabase/current-user-client";

export async function TenantDebug() {
    const { orgId } = await requireTenantContext()
    const supabase = createCurrentUserClient() //add await if your is async
    const { data: dbOrgId, error } = await supabase.rpc("requesting_org_id")
    
    return (
        <pre className="rounded-md border p-4 text-xs">
            {JSON.stringify(
                { clerkOrgId: orgId, databaseOrgId: dbOrgId, error: error?.message ?? null, match: orgId === dbOrgId },
                null,
                2
            )}
        </pre>
    )
}