import AppHeader from "@/components/shared/app-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">{ children }</main>
            </div>
        </div>
    )
}