import {Plus} from "lucide-react"
import Link from "next/link"

import {Button} from "@/components/ui/button"
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import {notFound, redirect} from "next/navigation";
import {DashboardMemberMetrics} from "@/app/dashboard/(overview)/_components/dashboard-member-metrics";
import {DashboardMemberEvents} from "@/app/dashboard/(overview)/_components/dashboard-member-events";
import {DashboardMemberPerformance} from "@/app/dashboard/(overview)/_components/dashboard-member-performance";
import {DashboardActivityFeed} from "@/app/dashboard/(overview)/_components/dashboard-activity-feed";
import {DashboardQuickActions} from "@/app/dashboard/(overview)/_components/dashboard-quick-actions";
import {DashboardMembersList} from "@/app/dashboard/(overview)/_components/dashboard-members-list";


export default async function DashboardPage() {
    // In a real app, this would come from user context/auth

    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!user) {
        return notFound();
    }

    if (user.onboarding) redirect('/onboarding')

    const userRole = (user.dashboardView === "owner" || user.dashboardView === "member")
        ? user.dashboardView
        : "member";

    return (
        <div className="p-6 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-white/60">
                        {userRole === "owner"
                            ? "Welcome back, John. Here's what's happening with your clubs."
                            : `Welcome back, ${user.name}. Here's your activity and upcoming events.`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {userRole === "owner" ? (
                        <>
                            <Button variant="outline" className="border-white/10 hover:bg-white/5" asChild>
                                <Link href="/dashboard/events/create">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    New Event
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/dashboard/clubs/city-runners/members/invite">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Invite Members
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" className="border-white/10 hover:bg-white/5" asChild>
                                <Link href="/dashboard/discover">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Join Club
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/dashboard/events?filter=ongoing">Check In to Event</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            {userRole === "owner" ? <div>Owner metrics would go here</div> : <DashboardMemberMetrics/>}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Member Events */}
                    {userRole === "member" && <DashboardMemberEvents/>}

                    {/* Member Performance */}
                    {userRole === "member" && <DashboardMemberPerformance/>}
                </div>

                {/* Sidebar Content */}
                <div className="space-y-6">
                    {/* Recent Activity */}
                    <DashboardActivityFeed/>

                    {/* Quick Actions */}
                    <DashboardQuickActions userRole={userRole}/>

                    {/* Club Members or New Members based on role */}
                    <DashboardMembersList/>
                </div>
            </div>
        </div>
    )
}
