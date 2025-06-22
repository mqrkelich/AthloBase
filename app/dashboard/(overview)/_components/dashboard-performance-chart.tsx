"use client"

import {useEffect, useState} from "react"
import {TrendingUp} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {getClubPerformanceData} from "@/app/dashboard/(overview)/_actions/dashboard-data"

interface DashboardPerformanceChartProps {
    clubId: string
}

interface PerformanceData {
    monthlyAttendance: Array<{
        month: string
        attendance: number
        events: number
    }>
    topPerformers: Array<{
        name: string
        attendanceRate: number
        eventsAttended: number
    }>
    clubGrowth: {
        newMembers: number
        totalMembers: number
        growthRate: number
    }
}

export function DashboardPerformanceChart({clubId}: DashboardPerformanceChartProps) {
    const [data, setData] = useState<PerformanceData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPerformanceData() {
            try {
                if (clubId && clubId !== "default") {
                    const performanceData = await getClubPerformanceData(clubId)
                    setData(performanceData)
                }
            } catch (error) {
                console.error("Failed to load performance data:", error)
            } finally {
                setLoading(false)
            }
        }

        loadPerformanceData()
    }, [clubId])

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Club Performance</CardTitle>
                    <CardDescription className="text-white/60">Loading performance data...</CardDescription>
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
                    <CardTitle>Club Performance</CardTitle>
                    <CardDescription className="text-white/60">Select a club to view performance data</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-white/60">No performance data available</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader>
                <CardTitle>Club Performance</CardTitle>
                <CardDescription className="text-white/60">Attendance trends and member engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Monthly Attendance Chart */}
                <div>
                    <h4 className="text-sm font-medium mb-3">Monthly Attendance Rate</h4>
                    <div className="space-y-2">
                        {data.monthlyAttendance.map((month) => (
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

                {/* Top Performers */}
                {data.topPerformers.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium mb-3">Top Performers</h4>
                        <div className="space-y-3">
                            {data.topPerformers.map((performer, index) => (
                                <div key={performer.name} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                    <div
                                        className="flex items-center justify-center w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full text-xs font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{performer.name}</p>
                                        <p className="text-xs text-white/60">{performer.eventsAttended} events
                                            attended</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-emerald-500">{performer.attendanceRate}%</p>
                                        <p className="text-xs text-white/60">attendance</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Club Growth */}
                <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Club Growth</h4>
                        <div className="flex items-center text-emerald-500 text-sm">
                            <TrendingUp className="mr-1 h-4 w-4"/>
                            <span>+{data.clubGrowth.growthRate}%</span>
                        </div>
                    </div>
                    <p className="text-xs text-white/60 mb-3">{data.clubGrowth.newMembers} new members joined this
                        month</p>
                    <Progress
                        value={
                            data.clubGrowth.totalMembers > 0 ? (data.clubGrowth.newMembers / data.clubGrowth.totalMembers) * 100 : 0
                        }
                        className="h-2 bg-white/10"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>{data.clubGrowth.newMembers} new</span>
                        <span>{data.clubGrowth.totalMembers} total</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
