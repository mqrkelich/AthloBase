"use client"

import {useEffect, useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {CalendarDays, Mail, Trophy, TrendingUp, Clock, Target} from "lucide-react"
import {getMemberProfile} from "../_actions/member-data"

interface MemberProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    memberId: string
    clubId: string
}

interface MemberProfile {
    id: string
    name: string
    email: string | null
    avatar: string | null
    role: string
    joinedAt: string
    lastActive: string
    attendanceRate: number
    eventsAttended: number
    totalEvents: number
    streak: number
    favoriteEventType: string
    achievements: string[]
    recentActivity: Array<{
        eventName: string
        date: string
        type: string
        attended: boolean
    }>
}

export function MemberProfileDialog({open, onOpenChange, memberId, clubId}: MemberProfileDialogProps) {
    const [profile, setProfile] = useState<MemberProfile | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && memberId && clubId) {
            loadProfile()
        }
    }, [open, memberId, clubId])

    const loadProfile = async () => {
        setLoading(true)
        try {
            const data = await getMemberProfile(memberId, clubId)
            setProfile(data)
        } catch (error) {
            console.error("Failed to load member profile:", error)
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

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "owner":
                return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
            case "admin":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            default:
                return "bg-green-500/20 text-green-400 border-green-500/30"
        }
    }

    const getAchievementColor = (achievement: string) => {
        switch (achievement) {
            case "Perfect Attendance":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30"
            case "Regular Attendee":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "On Fire!":
                return "bg-orange-500/20 text-orange-400 border-orange-500/30"
            case "Veteran Member":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Member Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-white/10 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-white/10 rounded w-1/3"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-20 bg-white/10 rounded"></div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    if (!profile) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-zinc-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Member Profile</DialogTitle>
                    </DialogHeader>
                    <p className="text-white/60">Failed to load member profile.</p>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Member Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Member Header */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name}/>
                            <AvatarFallback
                                className="bg-white/10 text-white text-lg">{getInitials(profile.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold">{profile.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={`${getRoleBadgeColor(profile.role)}`}>
                                    {profile.role}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-white/60">
                                    <CalendarDays className="h-4 w-4"/>
                                    Joined {new Date(profile.joinedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-white/10"/>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-400">{profile.attendanceRate}%</div>
                                <div className="text-sm text-white/60">Attendance Rate</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-400">{profile.eventsAttended}</div>
                                <div className="text-sm text-white/60">Events Attended</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-orange-400">{profile.streak}</div>
                                <div className="text-sm text-white/60">Current Streak</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-400">{profile.totalEvents}</div>
                                <div className="text-sm text-white/60">Total Events</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Achievements */}
                    {profile.achievements.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Trophy className="h-5 w-5 text-yellow-500"/>
                                <h4 className="font-semibold">Achievements</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profile.achievements.map((achievement, index) => (
                                    <Badge key={index} variant="outline" className={getAchievementColor(achievement)}>
                                        {achievement}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Target className="h-4 w-4"/>
                                    Favorite Event Type
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="text-lg font-semibold capitalize">{profile.favoriteEventType}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Clock className="h-4 w-4"/>
                                    Last Active
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div
                                    className="text-lg font-semibold">{new Date(profile.lastActive).toLocaleDateString()}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    {profile.recentActivity.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="h-5 w-5 text-blue-400"/>
                                <h4 className="font-semibold">Recent Activity</h4>
                            </div>
                            <div className="space-y-2">
                                {profile.recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                                    >
                                        <div>
                                            <div className="font-medium">{activity.eventName}</div>
                                            <div className="text-sm text-white/60 capitalize">{activity.type}</div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className="text-sm text-white/60">{new Date(activity.date).toLocaleDateString()}</div>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    activity.attended
                                                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                        : "bg-red-500/20 text-red-400 border-red-500/30"
                                                }
                                            >
                                                {activity.attended ? "Present" : "Absent"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
