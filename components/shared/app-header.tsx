import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "@/components/ui/sheet"
import  AppSidebar  from "@/components/shared/app-sidebar"

function AppHeader() {
    return (
        <header className='flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6'>
            <Sheet>
                <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />} >
                    <Menu className="h-5 w-5" />
                    <span className='sr-only'>Open Navigation Menu</span>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <AppSidebar />
                </SheetContent>
            </Sheet>

            <div className='flex-1' />
            
            {/* user account menu */}
      </header>
  )
}

export default AppHeader