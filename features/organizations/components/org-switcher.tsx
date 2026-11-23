import { ROUTES } from "@/config/routes";
import { OrganizationSwitcher } from "@clerk/nextjs";


export function OrgSwitcher() {
    return (
        <OrganizationSwitcher
            hidePersonal
            afterSelectOrganizationUrl={ROUTES.dashboard}
            afterCreateOrganizationUrl={ROUTES.dashboard}
            afterLeaveOrganizationUrl={ROUTES.selectOrganization}
        />
    )
}