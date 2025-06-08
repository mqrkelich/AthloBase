import { type ReactNode, Suspense } from "react"

import {SidebarProvider} from "@/components/ui/sidebar"
import {DashboardSidebar} from "@/app/dashboard/_components/layout/dashboard-sidebar";
import {DashboardHeader} from "@/app/dashboard/_components/layout/dashboard-header";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import {notFound} from "next/navigation";
import {getUserClubs} from "./_actions/user-data";


export default async function DashboardLayout({children}: { children: ReactNode }) {

    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!user) return notFound();

    // This would come from your auth/state management
    const currentRole: "owner" | "member" = user.dashboardView === "owner" || user.dashboardView === "member" ? user.dashboardView : "member";
    const [ownedClubs, memberClubs] = await Promise.all([
        getUserClubs(user.id, "owner"),
        getUserClubs(user.id, "member"),
    ]);

    const userRoles: ("owner" | "member")[] = [];
    if (ownedClubs && ownedClubs.length > 0) userRoles.push("owner");
    if (memberClubs && memberClubs.length > 0) userRoles.push("member");

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
