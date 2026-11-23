import { UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";

export default function OnboardingLayout({
    children
}: {
    children: React.ReactNode
    }) {
    return (
        <div className="flex min-h-svh flex-col">
            <header className="flex h-14 items-center justify-between border-b px-4">
                <span className="text-sm font-semibold">{siteConfig.name}</span>
                <UserButton />
            </header>
            <main className="flex flex-1 items-center justify-center p-4">
                {children}
            </main>
        </div>
    )
}