import { ROUTES } from "@/config/routes"
import { OrganizationList } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


export const metadata = { title: "Select Organization" }

export default async function SelectOrganizationPage() {
    const { orgId } = await auth()
    
    //already has an active org? nothing to choose
    if (orgId) redirect(ROUTES.dashboard)
    
    return (
        <OrganizationList
            hidePersonal
            afterSelectOrganizationUrl={ROUTES.dashboard}
            afterCreateOrganizationUrl={ROUTES.dashboard}
        />
    )
}