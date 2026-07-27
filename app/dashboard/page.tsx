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
        <header className="border-b bg-background">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <h1 className="text-lg font-bold">
                    CRM<span className="text-primary">Pro</span>
                </h1>
                <UserButton />
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">
            <h2 className="text-2xl font-semibold">
                Welcome back, {user?.firstName ?? 'there'} 👋
            </h2>
            <p className="mt-1 text-muted-foreground">
                Here's what's happening with your customers today.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Contacts
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Open Deals
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$0</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Activities
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  )
}

export default Dashboardpage