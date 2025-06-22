"use client"

import {useEffect, useState} from "react"
import {MoreHorizontal, Crown, Star} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {getClubMembers} from "@/app/dashboard/(overview)/_actions/dashboard-data"

interface DashboardMembersListProps {
    clubId?: string
    userRole: "owner" | "member"
}

interface Member {
    id: string
    name: string
    email: string | null
    avatar: string | null // Change from optional to nullable
    role: string // Change from union type to string to match API data
    joinedAt: string
    lastActive: string
    attendanceRate: number
    eventsAttended: number
}

export function DashboardMembersList({clubId, userRole}: DashboardMembersListProps) {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadMembers() {
            try {
                if (clubId && clubId !== "default") {
                    const data = await getClubMembers(clubId, 4)
                    setMembers(data)
                }
            } catch (error) {
                console.error("Failed to load members:", error)
            } finally {
                setLoading(false)
            }
        }

        loadMembers()
    }, [clubId])

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "owner":
                return <Crown className="h-3 w-3 text-yellow-500"/>
            case "admin":
                return <Star className="h-3 w-3 text-blue-400"/>
            default:
                return null
        }
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "owner":
                return "bg-yellow-500/20 text-yellow-500"
            case "admin":
                return "bg-blue-500/20 text-blue-400"
            default:
                return "bg-white/10 text-white/80"
        }
    }

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>{userRole === "owner" ? "Recent Members" : "Active Members"}</CardTitle>
                    <CardDescription className="text-white/60">Loading members...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="h-10 w-10 bg-white/10 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-white/10 rounded w-3/4 mb-1"></div>
                                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (members.length === 0) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>{userRole === "owner" ? "Recent Members" : "Active Members"}</CardTitle>
                    <CardDescription className="text-white/60">
                        {userRole === "owner" ? "No members found" : "No active members"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-white/60">
                        {userRole === "owner" ? "Invite members to get started!" : "Join a club to see active members"}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>{userRole === "owner" ? "Recent Members" : "Active Members"}</CardTitle>
                    <CardDescription className="text-white/60">
                        {userRole === "owner" ? "Newest additions to your club" : "Most active members in your clubs"}
                    </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={userRole === "owner" ? `/dashboard/clubs/${clubId}?tab=members` : "/dashboard/members"}>
                        View All
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.id}
                             className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name}/>
                                <AvatarFallback
                                    className="bg-white/10 text-white">{getInitials(member.name)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium truncate">{member.name}</p>
                                    {getRoleIcon(member.role)}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline"
                                           className={`text-xs border-0 ${getRoleBadgeColor(member.role)}`}>
                                        {member.role}
                                    </Badge>
                                    {userRole === "owner" && (
                                        <span
                                            className="text-xs text-white/60">{member.attendanceRate}% attendance</span>
                                    )}
                                </div>
                                <p className="text-xs text-white/60 mt-0.5">
                                    {userRole === "owner"
                                        ? `Joined ${new Date(member.joinedAt).toLocaleDateString()}`
                                        : `${member.eventsAttended} events attended`}
                                </p>
                            </div>

                            {userRole === "owner" && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-zinc-800 border-white/10">
                                        <DropdownMenuItem className="text-white hover:bg-white/10">View
                                            Profile</DropdownMenuItem>
                                        <DropdownMenuItem className="text-white hover:bg-white/10">Send
                                            Message</DropdownMenuItem>
                                        <DropdownMenuItem className="text-white hover:bg-white/10">View
                                            Attendance</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
