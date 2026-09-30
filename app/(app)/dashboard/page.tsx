import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { currentUser, auth } from '@clerk/nextjs/server'
import { Activity, DollarSign, TrendingUp, Users } from 'lucide-react'
import { redirect } from 'next/navigation'

async function Dashboardpage() {

    const { userId } = await auth()
    if (!userId) {
        redirect('/')
    }

    const user = await currentUser()

  return (
    <div className="min-h-screen bg-muted/20">
        <h1>Dashboard Page</h1>
    </div>
  )
}

export default Dashboardpage