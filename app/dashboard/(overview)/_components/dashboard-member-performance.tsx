"use client"

import {useEffect, useState} from "react"
import {TrendingUp, Calendar} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {Badge} from "@/components/ui/badge"
import {getMemberPerformanceData} from "@/app/dashboard/(overview)/_actions/dashboard-data"

interface DashboardMemberPerformanceProps {
    userId: string
}

interface MemberPerformanceData {
    monthlyPerformance: Array<{
        month: string
        attendance: number
        events: number
    }>
    recentEvents: Array<{
        id: string
        title: string
        date: Date
        clubName: string
        attended: boolean
    }>
    clubs: Array<{
        id: string
        name: string
    }>
}

export function DashboardMemberPerformance({userId}: DashboardMemberPerformanceProps) {
    const [data, setData] = useState<MemberPerformanceData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPerformanceData() {
            try {
                const performanceData = await getMemberPerformanceData(userId)
                setData(performanceData)
            } catch (error) {
                console.error("Failed to load member performance data:", error)
            } finally {
                setLoading(false)
            }
        }

        loadPerformanceData()
    }, [userId])

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>My Performance</CardTitle>
                    <CardDescription className="text-white/60">Loading your activity data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-32 bg-white/5 rounded animate-pulse"></div>
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-4 bg-white/5 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!data) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>My Performance</CardTitle>
                    <CardDescription className="text-white/60">No performance data available</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-white/60">Join a club and attend events to see your performance data!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader>
                <CardTitle>My Performance</CardTitle>
                <CardDescription className="text-white/60">Your attendance and activity trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Monthly Performance Chart */}
                <div>
                    <h4 className="text-sm font-medium mb-3">Monthly Attendance Rate</h4>
                    <div className="space-y-2">
                        {data.monthlyPerformance.map((month) => (
                            <div key={month.month} className="flex items-center gap-3">
                                <span className="text-xs text-white/60 w-8">{month.month}</span>
                                <div className="flex-1">
                                    <Progress value={month.attendance} className="h-2 bg-white/10"/>
                                </div>
                                <span className="text-xs text-white/80 w-12">{month.attendance}%</span>
                                <span className="text-xs text-white/60 w-16">{month.events} events</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Events */}
                {data.recentEvents.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-3">Recent Events</h4>
                        <div className="space-y-3">
                            {data.recentEvents.map((event) => (
                                <div key={event.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 text-emerald-500 rounded-full">
                                        <Calendar className="h-4 w-4"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{event.title}</p>
                                        <p className="text-xs text-white/60">
                                            {event.clubName} • {event.date.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs border-0 ${
                                            event.attended ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-400"
                                        }`}
                                    >
                                        {event.attended ? "Attended" : "Missed"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Club Summary */}
                {data.clubs.length > 0 && (
                    <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">
                                Active in {data.clubs.length} Club{data.clubs.length > 1 ? "s" : ""}
                            </h4>
                            <div className="flex items-center text-blue-400 text-sm">
                                <TrendingUp className="mr-1 h-4 w-4"/>
                                <span>Active</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {data.clubs.map((club) => (
                                <Badge key={club.id} variant="outline"
                                       className="text-xs border-white/20 text-white/80">
                                    {club.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
