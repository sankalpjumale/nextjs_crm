import {
    Building2,
    Contact,
    Handshake,
    LayoutDashboard,
    LucideIcon,
    Settings
} from "lucide-react"


type NavItems = {
    title: string,
    href: string,
    icon: LucideIcon
}

export const navItems: NavItems[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Companies", href: "/companies", icon: Building2 },
    { title: "Contacts", href: "/contacts", icon: Contact },
    { title: "Deals", href: "/deals", icon: Handshake },
    { title: "Settings", href: "/settings", icon: Settings }
]