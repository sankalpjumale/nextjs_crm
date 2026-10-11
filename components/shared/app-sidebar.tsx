"use client"

import { navItems } from '@/config/nav'
import { siteConfig } from '@/config/site'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

function AppSidebar() {

    const pathname = usePathname()

  return (
    <aside className='hidden w-64 flex-col border-r border-border bg-card md:flex'>
        <div className='flex h-16 items-center border-b border-border px-6'>
            <span className='text-lg font-semibold'>{siteConfig.name}</span>
        </div>

        <nav className='flex flex-1 flex-col gap-1 p-3'>
            {navItems.map((item) => {
                const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                  
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive 
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className='h-4 w-4'/>
                        {item.title}
                      </Link>
                  )
              })}
          </nav>  
    </aside>
  )
}

export default AppSidebar

