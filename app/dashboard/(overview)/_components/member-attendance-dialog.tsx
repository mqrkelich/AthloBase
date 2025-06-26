"use client"

import {useEffect, useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {ScrollArea} from "@/components/ui/scroll-area"
import {CalendarDays, Clock, MapPin, TrendingUp, TrendingDown, Minus} from "lucide-react"
import {getMemberAttendance} from "../_actions/member-data"

interface MemberAttendanceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    memberId: string
    clubId: string
}

interface AttendanceData {
    member: {
        id: string
        name: string
        avatar: string | null
    }
    stats: {
        totalEvents: number
        attended: number
        missed: number
        attendanceRate: number
        streak: number
        longestStreak: number
        recentTrend: "up" | "down" | "stable"
    }
    records: Array<{
        eventId: string
        eventName: string
        eventType: string
        date: string
        time: string
        location: string | null
        attended: boolean
        checkedInAt?: string
    }>
}

export function MemberAttendanceDialog({open, onOpenChange, memberId, clubId}: MemberAttendanceDialogProps) {
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && memberId && clubId) {
            loadAttendance()
        }
    }, [open, memberId, clubId])

    const loadAttendance = async () => {
        setLoading(true)
        try {
            const data = await getMemberAttendance(memberId, clubId)
            setAttendanceData(data)
        } catch (error) {
            console.error("Failed to load member attendance:", error)
        } finally {
            setLoading(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const getTrendIcon = (trend: "up" | "down" | "stable") => {
        switch (trend) {
            case "up":
                return <TrendingUp className="h-4 w-4 text-green-400"/>
            case "down":
                return <TrendingDown className="h-4 w-4 text-red-400"/>
            default:
                return <Minus className="h-4 w-4 text-white/60"/>
        }
    }

    const getTrendColor = (trend: "up" | "down" | "stable") => {
        switch (trend) {
            case "up":
                return "text-green-400"
            case "down":
                return "text-red-400"
            default:
                return "text-white/60"
        }
    }

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Member Attendance</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white/10 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-5 bg-white/10 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-white/10 rounded w-1/4"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-white/10 rounded"></div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-white/10 rounded"></div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    if (!attendanceData) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-zinc-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Member Attendance</DialogTitle>
                    </DialogHeader>
                    <p className="text-white/60">Failed to load attendance data.</p>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-3xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Member Attendance</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Member Header */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={attendanceData.member.avatar || "/placeholder.svg"}
                                         alt={attendanceData.member.name}/>
                            <AvatarFallback className="bg-white/10 text-white">
                                {getInitials(attendanceData.member.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{attendanceData.member.name}</h3>
                            <p className="text-white/60">Attendance Overview</p>
                        </div>
                    </div>

                    <Separator className="bg-white/10"/>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div
                                    className="text-2xl font-bold text-green-400">{attendanceData.stats.attendanceRate}%
                                </div>
                                <div className="text-sm text-white/60">Attendance Rate</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-400">{attendanceData.stats.attended}</div>
                                <div className="text-sm text-white/60">Events Attended</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-orange-400">{attendanceData.stats.streak}</div>
                                <div className="text-sm text-white/60">Current Streak</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div
                                    className="text-2xl font-bold text-purple-400">{attendanceData.stats.longestStreak}</div>
                                <div className="text-sm text-white/60">Longest Streak</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Total Events</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-lg font-semibold">{attendanceData.stats.totalEvents}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Missed Events</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-lg font-semibold text-red-400">{attendanceData.stats.missed}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    Recent Trend
                                    {getTrendIcon(attendanceData.stats.recentTrend)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div
                                    className={`text-lg font-semibold capitalize ${getTrendColor(attendanceData.stats.recentTrend)}`}>
                                    {attendanceData.stats.recentTrend}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Attendance Records */}
                    <div>
                        <h4 className="font-semibold mb-3">Attendance History</h4>
                        <ScrollArea className="h-64">
                            <div className="space-y-2 pr-4">
                                {attendanceData.records.map((record, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium">{record.eventName}</div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                                                <div className="flex items-center gap-1">
                                                    <CalendarDays className="h-3 w-3"/>
                                                    {new Date(record.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3"/>
                                                    {record.time}
                                                </div>
                                                {record.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3"/>
                                                        {record.location}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-1">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs capitalize bg-blue-500/20 text-blue-400 border-blue-500/30"
                                                >
                                                    {record.eventType}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    record.attended
                                                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                        : "bg-red-500/20 text-red-400 border-red-500/30"
                                                }
                                            >
                                                {record.attended ? "Present" : "Absent"}
                                            </Badge>
                                            {record.checkedInAt && (
                                                <div className="text-xs text-white/60 mt-1">
                                                    Checked in: {new Date(record.checkedInAt).toLocaleTimeString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
