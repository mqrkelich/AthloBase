"use client"

import {useState, useEffect} from "react"
import {
    Calendar,
    Users,
    MessageSquare,
    Trophy,
    Clock,
    MapPin,
    Bell,
    Activity,
    Target,
    TrendingUp,
    CheckCircle,
    UserCheck,
    UserX,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Separator} from "@/components/ui/separator"
import {formatDate} from "@/lib/utils"
import {registerForEvent, unregisterFromEvent, getMemberEventStats} from "@/app/dashboard/clubs/_actions/events"
import {toast} from "sonner"

interface Member {
    id: string
    name: string
    email: string | null
    image: string | null
    joined: Date | null
}

interface Event {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    attendees: number
    maxAttendees?: number
    status: string
    type: string
    isRegistered?: boolean
    hasAttended?: boolean
}

interface CustomStat {
    id: string
    label: string
    value: string
    unit: string
    icon: string
}

interface Club {
    id: string
    name: string
    sport: string
    description: string
    coverImage: string
    logo: string
    memberCount: number
    activeEvents: number
    totalEvents: number
    foundedDate: string | null
    createdAt: Date
    location: string
    website: string
    members: (Member | null)[]
    customStats: CustomStat[]
    meetingDays: string[]
    meetingTime: string
    skillLevel: string
    ageGroup: string
}

interface User {
    id: string
    name: string | null
    email: string | null
    image: string | null
}

interface MemberStats {
    eventsRegistered: number
    eventsAttended: number
    attendanceRate: number
    memberSince: Date
    recentEvents: Array<{
        id: string
        title: string
        date: Date
        attended: boolean
    }>
}

interface ClubMemberClientProps {
    club: Club
    clubId: string
    currentUser: User
    events: Event[]
}

export default function ClubMemberClient({club, clubId, currentUser, events: initialEvents}: ClubMemberClientProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const [events, setEvents] = useState(initialEvents)
    const [memberStats, setMemberStats] = useState<MemberStats | null>(null)
    const [loading, setLoading] = useState<string | null>(null)

    useEffect(() => {
        // Load member stats
        getMemberEventStats(clubId).then((stats) => {
            if (stats) {
                setMemberStats(stats)
            }
        })
    }, [clubId])

    const handleRSVP = async (eventId: string, isRegistered: boolean) => {
        setLoading(eventId)

        try {
            const result = isRegistered ? await unregisterFromEvent(eventId) : await registerForEvent(eventId)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)

                // Update the events list
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === eventId
                            ? {
                                ...event,
                                isRegistered: !isRegistered,
                                attendees: isRegistered ? event.attendees - 1 : event.attendees + 1,
                            }
                            : event,
                    ),
                )

                // Refresh member stats
                const updatedStats = await getMemberEventStats(clubId)
                if (updatedStats) {
                    setMemberStats(updatedStats)
                }
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(null)
        }
    }

    const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date()).slice(0, 3)
    const recentEvents = events.filter((event) => new Date(event.date) < new Date()).slice(0, 3)

    const defaultMemberStats = {
        eventsRegistered: memberStats?.eventsRegistered || 0,
        eventsAttended: memberStats?.eventsAttended || 0,
        attendanceRate: memberStats?.attendanceRate || 0,
        memberSince: memberStats?.memberSince || new Date(),
        membershipDuration: memberStats?.memberSince
            ? `${Math.floor((new Date().getTime() - new Date(memberStats.memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
            : "New member",
    }

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {club.logo ? (
                        <img
                            src={club.logo || "/placeholder.svg"}
                            alt={`${club.name} logo`}
                            className="h-16 w-16 rounded object-cover"
                        />
                    ) : (
                        <div
                            className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                            {club.name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{club.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-500 border-0">
                                {club.sport}
                            </Badge>
                            <span className="text-white/60 text-sm">Member since {formatDate(club.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        <Bell className="mr-2 h-4 w-4"/>
                        Notifications
                    </Button>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        <MessageSquare className="mr-2 h-4 w-4"/>
                        Messages
                    </Button>
                </div>
            </div>

            {/* Member Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Events Registered</p>
                                <p className="text-2xl font-bold">{defaultMemberStats.eventsRegistered}</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-blue-500"/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Events Attended</p>
                                <p className="text-2xl font-bold">{defaultMemberStats.eventsAttended}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-emerald-500"/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Attendance Rate</p>
                                <p className="text-2xl font-bold">{defaultMemberStats.attendanceRate}%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-orange-500"/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Member For</p>
                                <p className="text-2xl font-bold">{defaultMemberStats.membershipDuration}</p>
                            </div>
                            <Trophy className="h-8 w-8 text-purple-500"/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-zinc-800/50 text-white/60 w-full justify-start overflow-x-auto">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <Activity className="h-4 w-4"/>
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4"/>
                        Events
                    </TabsTrigger>
                    <TabsTrigger value="members" className="flex items-center gap-2">
                        <Users className="h-4 w-4"/>
                        Members
                    </TabsTrigger>
                    <TabsTrigger value="about" className="flex items-center gap-2">
                        <Target className="h-4 w-4"/>
                        About Club
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Upcoming Events */}
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5"/>
                                        Upcoming Events
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {upcomingEvents.length > 0 ? (
                                        upcomingEvents.map((event) => (
                                            <div key={event.id} className="bg-white/5 p-4 rounded-lg">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-medium">{event.title}</h4>
                                                            {event.isRegistered && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-emerald-500/20 text-emerald-500 border-0 text-xs"
                                                                >
                                                                    Registered
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-white/60">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4"/>
                                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4"/>
                                                                <span>{event.time}</span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="flex items-center gap-1 mt-1 text-sm text-white/60">
                                                            <MapPin className="h-4 w-4"/>
                                                            <span>{event.location}</span>
                                                        </div>
                                                        <div className="mt-2 text-sm text-white/60">
                                                            {event.attendees} registered
                                                            {event.maxAttendees && ` / ${event.maxAttendees} max`}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="ml-4"
                                                        variant={event.isRegistered ? "outline" : "default"}
                                                        onClick={() => handleRSVP(event.id, event.isRegistered || false)}
                                                        disabled={loading === event.id}
                                                    >
                                                        {loading === event.id ? "..." : event.isRegistered ? "Cancel" : "RSVP"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-white/60 text-center py-4">No upcoming events</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5"/>
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {memberStats?.recentEvents && memberStats.recentEvents.length > 0 ? (
                                        memberStats.recentEvents.map((event) => (
                                            <div key={event.id} className="flex items-center gap-3">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${event.attended ? "bg-emerald-500" : "bg-orange-500"}`}
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{event.title}</p>
                                                    <p className="text-xs text-white/60">{new Date(event.date).toLocaleDateString()}</p>
                                                </div>
                                                {event.attended ? (
                                                    <CheckCircle className="h-4 w-4 text-emerald-500"/>
                                                ) : (
                                                    <UserX className="h-4 w-4 text-orange-500"/>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-white/60 text-center py-4">No recent activity</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Club Stats */}
                        {club.customStats.length > 0 && (
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle>Club Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {club.customStats.map((stat) => (
                                            <div key={stat.id} className="bg-white/5 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-emerald-500">
                                                    {stat.value}
                                                    <span
                                                        className="text-sm text-white/40 font-normal"> {stat.unit}</span>
                                                </div>
                                                <div className="text-sm text-white/60">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="events" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Upcoming Events */}
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle>Upcoming Events</CardTitle>
                                    <CardDescription className="text-white/60">Events you can attend</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {upcomingEvents.map((event) => (
                                        <div key={event.id} className="bg-white/5 p-4 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-medium">{event.title}</h4>
                                                        <Badge variant="outline"
                                                               className="bg-blue-500/20 text-blue-500 border-0 text-xs">
                                                            {event.type}
                                                        </Badge>
                                                        {event.isRegistered && (
                                                            <Badge variant="outline"
                                                                   className="bg-emerald-500/20 text-emerald-500 border-0 text-xs">
                                                                Registered
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-white/70 mb-3">{event.description}</p>
                                                    <div className="flex items-center gap-4 text-sm text-white/60">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4"/>
                                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4"/>
                                                            <span>{event.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4"/>
                                                            <span>{event.location}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-sm text-white/60">
                                                        {event.attendees} registered
                                                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 ml-4">
                                                    <Button
                                                        size="sm"
                                                        variant={event.isRegistered ? "outline" : "default"}
                                                        onClick={() => handleRSVP(event.id, event.isRegistered || false)}
                                                        disabled={loading === event.id}
                                                    >
                                                        {loading === event.id ? "..." : event.isRegistered ? "Cancel" : "RSVP"}
                                                    </Button>
                                                    <Button size="sm" variant="outline"
                                                            className="border-white/10 hover:bg-white/5">
                                                        Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Past Events */}
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle>Past Events</CardTitle>
                                    <CardDescription className="text-white/60">Your event history</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentEvents.map((event) => (
                                        <div key={event.id} className="bg-white/5 p-4 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium">{event.title}</h4>
                                                        <Badge variant="outline"
                                                               className="bg-blue-500/20 text-blue-500 border-0 text-xs">
                                                            {event.type}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{event.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {event.hasAttended ? (
                                                        <>
                                                            <CheckCircle className="h-5 w-5 text-emerald-500"/>
                                                            <span className="text-sm text-emerald-500">Attended</span>
                                                        </>
                                                    ) : event.isRegistered ? (
                                                        <>
                                                            <UserX className="h-5 w-5 text-orange-500"/>
                                                            <span className="text-sm text-orange-500">Missed</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-5 w-5 rounded-full bg-gray-500"/>
                                                            <span
                                                                className="text-sm text-gray-500">Not Registered</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="members" className="space-y-6">
                        <Card className="bg-zinc-900/50 border-white/10 text-white">
                            <CardHeader>
                                <CardTitle>Club Members</CardTitle>
                                <CardDescription className="text-white/60">Connect with other members
                                    of {club.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {club.members.map(
                                        (member, index) =>
                                            member && (
                                                <div key={index} className="bg-white/5 p-4 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={member.image || "/placeholder.svg"}
                                                                         alt={member.name}/>
                                                            <AvatarFallback>
                                                                {member.name
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <p className="font-medium">{member.name}</p>
                                                            <p className="text-sm text-white/60">Joined {formatDate(member.joined || new Date())}</p>
                                                        </div>
                                                        <Button size="sm" variant="outline"
                                                                className="border-white/10 hover:bg-white/5">
                                                            <MessageSquare className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="about" className="space-y-6">
                        <Card className="bg-zinc-900/50 border-white/10 text-white">
                            <CardHeader>
                                <CardTitle>About {club.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="prose prose-invert max-w-none">
                                    {club.description.split("\n\n").map((paragraph, index) => (
                                        <p key={index} className="text-white/70 leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                <Separator className="bg-white/10"/>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Club Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Sport</span>
                                                <span>{club.sport}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Location</span>
                                                <span>{club.location}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Founded</span>
                                                <span>{club.foundedDate || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Skill Level</span>
                                                <span>{club.skillLevel}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Age Group</span>
                                                <span>{club.ageGroup}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Schedule</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Meeting Days</span>
                                                <span>{club.meetingDays.join(", ")}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Meeting Time</span>
                                                <span>{club.meetingTime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Total Members</span>
                                                <span>{club.memberCount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Total Events</span>
                                                <span>{club.totalEvents}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
