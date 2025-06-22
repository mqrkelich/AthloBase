"use client"

import {useEffect, useState} from "react"
import {TrendingUp, Calendar, Users} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {getMemberDashboardMetrics} from "@/app/dashboard/(overview)/_actions/dashboard-data"

interface DashboardMemberMetricsProps {
    userId: string
}

interface MemberMetrics {
    eventsAttended: number
    eventsThisMonth: number
    totalClubs: number
    clubNames: string[]
    upcomingEvents: number
    nextEventDate: string
    attendanceRate: number
    memberSince: string
}

export function DashboardMemberMetrics({userId}: DashboardMemberMetricsProps) {
    const [metrics, setMetrics] = useState<MemberMetrics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadMemberMetrics() {
            try {
                const data = await getMemberDashboardMetrics(userId)
                setMetrics(data)
            } catch (error) {
                console.error("Failed to load member metrics:", error)
            } finally {
                setLoading(false)
            }
        }

        loadMemberMetrics()
    }, [userId])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-zinc-900/50 border-white/10 text-white">
                        <CardHeader className="pb-2">
                            <div className="h-4 bg-white/10 rounded animate-pulse mb-2"></div>
                            <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!metrics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-white/60">No data available</CardDescription>
                        <CardTitle className="text-2xl">--</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Events Attended</CardDescription>
                    <CardTitle className="text-2xl">{metrics.eventsAttended}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-emerald-500">
                        <TrendingUp className="mr-1 h-4 w-4"/>
                        <span>+{metrics.eventsThisMonth} this month</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">My Clubs</CardDescription>
                    <CardTitle className="text-2xl">{metrics.totalClubs}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-white/60">
                        <Users className="mr-1 h-4 w-4"/>
                        <span className="truncate">{metrics.clubNames.join(", ") || "No clubs joined"}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Upcoming Events</CardDescription>
                    <CardTitle className="text-2xl">{metrics.upcomingEvents}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-white/60">
                        <Calendar className="mr-1 h-4 w-4"/>
                        <span>Next: {metrics.nextEventDate}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Attendance Rate</CardDescription>
                    <CardTitle className="text-2xl">{metrics.attendanceRate}%</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Progress value={metrics.attendanceRate} className="h-2 bg-white/10 flex-1"/>
                        <span className="text-xs text-emerald-500 ml-2 font-medium">
              {metrics.attendanceRate >= 90 ? "Excellent!" : metrics.attendanceRate >= 70 ? "Good!" : "Keep going!"}
            </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
