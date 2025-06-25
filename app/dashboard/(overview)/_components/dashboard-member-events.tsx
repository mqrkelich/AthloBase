"use client"

import {useEffect, useState} from "react"
import {Calendar, MapPin, Users, Clock, UserCheck} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {getDashboardEvents} from "@/app/dashboard/(overview)/_actions/dashboard-data"
import {registerForEvent, unregisterFromEvent} from "@/app/dashboard/clubs/_actions/events"
import {toast} from "sonner"

interface DashboardMemberEventsProps {
    userId: string
}

interface Event {
    id: string
    title: string
    description: string | null
    date: Date
    time: string
    location: string | null
    clubName: string
    isRegistered: boolean
    registrationCount: number
    capacity: number | null
    duration?: number
    clubId?: string
}

function isEventActive(eventDate: Date, eventTime: string, duration = 120): boolean {
    const now = new Date()

    // Ensure eventDate is a proper Date object
    const eventDateObj = eventDate instanceof Date ? eventDate : new Date(eventDate)

    // Create event start time
    const [hours, minutes] = eventTime.split(":").map(Number)
    const eventStart = new Date(eventDateObj)
    eventStart.setHours(hours, minutes, 0, 0)

    // Calculate event end time (duration is in minutes)
    const eventEnd = new Date(eventStart.getTime() + duration * 60 * 1000)

    // Debug logging
    console.log("Member Event Active Check:", {
        now: now.toISOString(),
        eventDate: eventDateObj.toISOString(),
        eventTime,
        eventStart: eventStart.toISOString(),
        eventEnd: eventEnd.toISOString(),
        duration,
        isActive: now >= eventStart && now <= eventEnd,
    })

    // Check if current time is within event duration
    return now >= eventStart && now <= eventEnd
}

export function DashboardMemberEvents({userId}: DashboardMemberEventsProps) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getDashboardEvents(userId, 10) // Get more events to show active ones
                setEvents(data || [])
            } catch (error) {
                console.error("Failed to load events:", error)
            } finally {
                setLoading(false)
            }
        }

        loadEvents()

        // Refresh every minute to update active status
        const interval = setInterval(loadEvents, 60000)
        return () => clearInterval(interval)
    }, [userId])

    const handleRSVP = async (eventId: string, isRegistered: boolean) => {
        setActionLoading(eventId)

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
                                registrationCount: isRegistered ? event.registrationCount - 1 : event.registrationCount + 1,
                            }
                            : event,
                    ),
                )
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setActionLoading(null)
        }
    }

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Your Events</CardTitle>
                    <CardDescription className="text-white/60">Loading events...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg animate-pulse">
                                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-white/10 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (events.length === 0) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Your Events</CardTitle>
                    <CardDescription className="text-white/60">No upcoming events</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-white/60">Join some clubs to see their events!</p>
                </CardContent>
            </Card>
        )
    }

    // Separate active and upcoming events
    const activeEvents = events.filter((event) => {
        const eventDuration = event.duration || 60 // Default to 60 minutes
        return isEventActive(event.date, event.time, eventDuration)
    })
    const upcomingEvents = events.filter((event) => {
        const eventDuration = event.duration || 60 // Default to 60 minutes
        return !isEventActive(event.date, event.time, eventDuration)
    })

    return (
        <div className="space-y-6">
            {/* Active Events */}
            {activeEvents.length > 0 && (
                <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/20 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Active Events ({activeEvents.length})
                        </CardTitle>
                        <CardDescription className="text-green-200">Events happening right now</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activeEvents.map((event) => (
                                <div key={event.id}
                                     className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{event.title}</h4>
                                            <Badge
                                                className="bg-green-500 text-white border-0 text-xs animate-pulse">LIVE</Badge>
                                            {event.isRegistered && (
                                                <Badge
                                                    className="bg-blue-500 text-white border-0 text-xs">Registered</Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-green-100 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4"/>
                                            <span>
                        {event.time} • {event.clubName}
                      </span>
                                        </div>

                                        {event.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4"/>
                                                <span>{event.location}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4"/>
                                                <span>{event.registrationCount} registered</span>
                                            </div>
                                            {event.capacity && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4"/>
                                                    <span>{event.capacity - event.registrationCount} spots left</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {!event.isRegistered ? (
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleRSVP(event.id, false)}
                                                disabled={actionLoading === event.id}
                                            >
                                                {actionLoading === event.id ? "..." : "Join Event"}
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-green-500/30 text-green-100 hover:bg-green-500/20"
                                                    onClick={() => handleRSVP(event.id, true)}
                                                    disabled={actionLoading === event.id}
                                                >
                                                    {actionLoading === event.id ? "..." : "Cancel Registration"}
                                                </Button>
                                                <div
                                                    className="flex items-center gap-1 px-3 py-1 bg-green-500/30 rounded text-xs">
                                                    <UserCheck className="h-3 w-3"/>
                                                    <span>Ready for attendance</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upcoming Events */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription className="text-white/60">Events you can join</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/discover">Discover More</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {upcomingEvents.slice(0, 5).map((event) => (
                            <div key={event.id}
                                 className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{event.title}</h4>
                                        {event.isRegistered && (
                                            <Badge variant="outline"
                                                   className="bg-blue-500/20 text-blue-400 border-0 text-xs">
                                                Registered
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1 text-sm text-white/60 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4"/>
                                        <span>
                      {event.date.toLocaleDateString()} at {event.time} • {event.clubName}
                    </span>
                                    </div>

                                    {event.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4"/>
                                            <span>{event.location}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4"/>
                                            <span>{event.registrationCount} registered</span>
                                        </div>
                                        {event.capacity && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4"/>
                                                <span>{event.capacity - event.registrationCount} spots left</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant={event.isRegistered ? "outline" : "default"}
                                    onClick={() => handleRSVP(event.id, event.isRegistered)}
                                    disabled={actionLoading === event.id}
                                >
                                    {actionLoading === event.id ? "..." : event.isRegistered ? "Cancel" : "Join"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
