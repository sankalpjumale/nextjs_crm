import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { currentUser, auth } from '@clerk/nextjs/server'

async function Dashboardpage() {

    const user = await currentUser()
    const {orgRole, orgSlug} = await auth()

  return (
      <div className='p-8'>
        <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <div className='flex items-center gap-4'>
                <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
                <UserButton />
            </div>
        </div>
        <p>Welsome, {user?.firstName}</p>
        <p>Oragnization: {orgSlug} - Role: {orgRole}</p>
    </div>
  )
}

export default Dashboardpage