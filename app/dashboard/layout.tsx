import { type ReactNode, Suspense } from "react"

import {SidebarProvider} from "@/components/ui/sidebar"
import {DashboardSidebar} from "@/app/dashboard/_components/layout/dashboard-sidebar";
import {DashboardHeader} from "@/app/dashboard/_components/layout/dashboard-header";


export default function DashboardLayout({children}: { children: ReactNode }) {
    // This would come from your auth/state management
    const currentRole = "owner" // or "member"
    const userRoles = ["owner", "member"] // User can be both

    return (
        <div className="min-h-screen bg-black text-white">
            <SidebarProvider>
                <DashboardSidebar currentRole={currentRole} userRoles={userRoles}/>

                {/* Main Content */}
                <div className="flex flex-col flex-1">
                    <DashboardHeader currentRole={currentRole}/>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto">
                        <Suspense>{children}</Suspense>
                    </main>
                </div>
            </SidebarProvider>
        </div>
    )
}
