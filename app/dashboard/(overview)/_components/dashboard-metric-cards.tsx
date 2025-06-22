"use client"

import {useEffect, useState} from "react"
import {TrendingUp, Calendar, Trophy, Target} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {getOwnerDashboardMetrics} from "@/app/dashboard/(overview)/_actions/dashboard-data"

interface DashboardMetricCardsProps {
    clubId: string
}

interface ClubMetrics {
    totalMembers: number
    memberGrowth: number
    upcomingEvents: number
    nextEventDate: string
    totalEvents: number
    eventGrowth: number
    avgAttendance: number
    attendanceChange: number
}

export function DashboardMetricCards({clubId}: DashboardMetricCardsProps) {
    const [metrics, setMetrics] = useState<ClubMetrics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadMetrics() {
            try {
                if (clubId && clubId !== "default") {
                    const data = await getOwnerDashboardMetrics(clubId)
                    setMetrics(data)
                }
            } catch (error) {
                console.error("Failed to load club metrics:", error)
            } finally {
                setLoading(false)
            }
        }

        loadMetrics()
    }, [clubId])

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
                        <CardDescription className="text-white/60">Select a club</CardDescription>
                        <CardTitle className="text-2xl">--</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center text-sm text-white/60">
                            <span>No club selected</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Total Members</CardDescription>
                    <CardTitle className="text-2xl">{metrics.totalMembers}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-emerald-500">
                        <TrendingUp className="mr-1 h-4 w-4"/>
                        <span>+{metrics.memberGrowth} this month</span>
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
                    <CardDescription className="text-white/60">Total Events</CardDescription>
                    <CardTitle className="text-2xl">{metrics.totalEvents}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-blue-400">
                        <Trophy className="mr-1 h-4 w-4"/>
                        <span>+{metrics.eventGrowth} this year</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Avg Attendance</CardDescription>
                    <CardTitle className="text-2xl">{metrics.avgAttendance}%</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-emerald-500">
                        <Target className="mr-1 h-4 w-4"/>
                        <span>Club average</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
