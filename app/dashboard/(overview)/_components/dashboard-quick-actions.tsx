import {
    ArrowUpRight,
    Calendar,
    Plus,
    Users,
    BarChart3,
    Ticket,
    MessageSquare,
    Trophy,
    Clock,
    UserCheck,
} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

interface DashboardQuickActionsProps {
    userRole?: "owner" | "member"
}

export function DashboardQuickActions({userRole = "member"}: DashboardQuickActionsProps) {
    const ownerActions = [
        {
            icon: Plus,
            label: "Create New Event",
            href: "/dashboard/events/create",
        },
        {
            icon: Users,
            label: "Invite Members",
            href: "/dashboard/clubs/city-runners/members/invite",
        },
        {
            icon: Calendar,
            label: "Schedule Practice",
            href: "/dashboard/events/create?type=practice",
        },
        {
            icon: ArrowUpRight,
            label: "Share Club Page",
            href: "/dashboard/clubs/city-runners/share",
        },
        {
            icon: BarChart3,
            label: "Member Data",
            href: "/dashboard/city-runners/member-data",
        },
        {
            icon: Ticket,
            label: "Join with Code",
            href: "/dashboard/discover",
        },
    ]

    const memberActions = [
        {
            icon: Calendar,
            label: "View My Events",
            href: "/dashboard/events?filter=my-events",
        },
        {
            icon: UserCheck,
            label: "Mark Attendance",
            href: "/dashboard/events?filter=ongoing",
        },
        {
            icon: Trophy,
            label: "My Performance",
            href: "/dashboard/profile/performance",
        },
        {
            icon: MessageSquare,
            label: "Club Messages",
            href: "/dashboard/messages",
        },
        {
            icon: Ticket,
            label: "Join New Club",
            href: "/dashboard/discover",
        },
        {
            icon: Clock,
            label: "Training Schedule",
            href: "/dashboard/schedule",
        },
    ]

    const actions = userRole === "owner" ? ownerActions : memberActions

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start border-white/10 hover:bg-white/5"
                        asChild
                    >
                        <Link href={action.href}>
                            <action.icon className="mr-2 h-4 w-4"/>
                            {action.label}
                        </Link>
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
}
