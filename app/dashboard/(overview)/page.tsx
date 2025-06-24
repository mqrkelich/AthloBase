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

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">{userRole === "owner" ? "Club Dashboard" : "My Dashboard"}</h1>
                <p className="text-white/60">
                    {userRole === "owner" ? "Manage your club and track performance" : "Track your activity and upcoming events"}
                </p>
            </div>

            {/* Active Events Widget - Show for both owners and members */}
            {userRole === "owner" ? <ActiveEventsWidget clubId={selectedClub}/> :
                <ActiveEventsWidget userId={user.id}/>}

            {/* Metrics Cards */}
            {userRole === "owner" ? (
                <DashboardMetricCards clubId={selectedClub}/>
            ) : (
                <DashboardMemberMetrics userId={user.id}/>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Events */}
                {userRole === "owner" ? (
                    <DashboardEventsList clubId={selectedClub}/>
                ) : (
                    <DashboardMemberEvents userId={user.id}/>
                )}

                {/* Members/Performance */}
                {userRole === "owner" ? (
                    <DashboardMembersList clubId={selectedClub} userRole="owner"/>
                ) : (
                    <DashboardMemberPerformance userId={user.id}/>
                )}
            </div>

            {/* Performance Chart */}
            {userRole === "owner" && <DashboardPerformanceChart clubId={selectedClub}/>}

            {/* Quick Actions */}
            <DashboardQuickActions userRole={userRole} clubId={selectedClub}/>
        </div>
    )
}
