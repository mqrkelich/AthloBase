import {getCurrentUser} from "@/lib/helper/session"
import {getUserById} from "@/data/user"
import {DashboardMetricCards} from "./_components/dashboard-metric-cards"
import {DashboardMemberMetrics} from "./_components/dashboard-member-metrics"
import {DashboardEventsList} from "./_components/dashboard-events-list"
import {DashboardMemberEvents} from "./_components/dashboard-member-events"
import {DashboardMembersList} from "./_components/dashboard-members-list"
import {DashboardPerformanceChart} from "./_components/dashboard-performance-chart"
import {DashboardMemberPerformance} from "./_components/dashboard-member-performance"
import {DashboardQuickActions} from "./_components/dashboard-quick-actions"
import {ActiveEventsWidget} from "./_components/active-events-widget"

export default async function DashboardPage() {
    const session = await getCurrentUser()
    if (!session) {
        return <div>Please log in to view dashboard</div>
    }

    const user = await getUserById(session.id!)
    if (!user) {
        return <div>User not found</div>
    }

    const selectedClub = user.selectedClubId || "default"
    const userRole: "owner" | "member" =
        user.dashboardView === "owner" || user.dashboardView === "member" ? user.dashboardView : "member"

    if (userRole === "member") {
        return (
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
                    <p className="text-white/60">Track your activity and upcoming events</p>
                </div>

                {/* Active Events Widget */}
                <ActiveEventsWidget userId={user.id}/>

                {/* Metrics Cards */}
                <DashboardMemberMetrics userId={user.id}/>

                {/* Main Content - 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Events (spans 2 columns) */}
                    <div className="lg:col-span-2">
                        <DashboardMemberEvents userId={user.id}/>
                    </div>

                    {/* Right Column - Performance and Quick Actions */}
                    <div className="space-y-6">
                        <DashboardMemberPerformance userId={user.id}/>
                        <DashboardQuickActions userRole={userRole} clubId={selectedClub}/>
                    </div>
                </div>
            </div>
        )
    }

    // Owner Dashboard (unchanged)
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Club Dashboard</h1>
                <p className="text-white/60">Manage your club and track performance</p>
            </div>

            {/* Active Events Widget */}
            <ActiveEventsWidget clubId={selectedClub}/>

            {/* Metrics Cards */}
            <DashboardMetricCards clubId={selectedClub}/>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardEventsList clubId={selectedClub}/>
                <DashboardMembersList clubId={selectedClub} userRole="owner"/>
            </div>

            {/* Bottom Grid - Performance Chart and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardPerformanceChart clubId={selectedClub}/>
                <DashboardQuickActions userRole={userRole} clubId={selectedClub}/>
            </div>
        </div>
    )
}
