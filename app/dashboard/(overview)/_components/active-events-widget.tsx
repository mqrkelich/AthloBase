"use client"

import {useEffect, useState} from "react"
import {Calendar, MapPin, Users, Clock, UserCheck} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {getOwnerEvents, getDashboardEvents} from "@/app/dashboard/(overview)/_actions/dashboard-data"
import {registerForEvent, unregisterFromEvent} from "@/app/dashboard/clubs/_actions/events"
import {toast} from "sonner"

interface ActiveEventsWidgetProps {
    clubId?: string
    userId?: string
}

interface Event {
    id: string
    title: string
    description: string | null
    date: Date
    time: string
    location: string | null
    registrationCount: number
    attendanceCount?: number
    capacity: number | null
    duration?: number
    clubName?: string
    clubId?: string
    isRegistered?: boolean
}

function isEventActive(eventDate: Date, eventTime: string, duration = 60): boolean {
    const now = new Date()

    // Ensure eventDate is a proper Date object
    const eventDateObj = eventDate instanceof Date ? eventDate : new Date(eventDate)

    // Parse the time string
    const [hours, minutes] = eventTime.split(":").map(Number)

    // Create event start time using the event date but with local timezone
    const eventStart = new Date(
        eventDateObj.getFullYear(),
        eventDateObj.getMonth(),
        eventDateObj.getDate(),
        hours,
        minutes,
        0,
        0,
    )

    // Calculate event end time (duration is in minutes)
    const eventEnd = new Date(eventStart.getTime() + duration * 60 * 1000)

    // Debug logging
    console.log("Event Active Check:", {
        eventTitle: "Event", // We don't have title here, but useful for debugging
        now: now.toISOString(),
        nowLocal: now.toLocaleString(),
        eventDate: eventDateObj.toISOString(),
        eventTime,
        eventStart: eventStart.toISOString(),
        eventStartLocal: eventStart.toLocaleString(),
        eventEnd: eventEnd.toISOString(),
        eventEndLocal: eventEnd.toLocaleString(),
        duration,
        isActive: now >= eventStart && now <= eventEnd,
        nowTime: now.getTime(),
        startTime: eventStart.getTime(),
        endTime: eventEnd.getTime(),
        timeDiff: now.getTime() - eventStart.getTime(),
        timeUntilEnd: eventEnd.getTime() - now.getTime(),
    })

    // Check if current time is within event duration
    return now >= eventStart && now <= eventEnd
}

export function ActiveEventsWidget({clubId, userId}: ActiveEventsWidgetProps) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const isOwnerView = !!clubId && !userId
    const isMemberView = !!userId && !clubId

    useEffect(() => {
        async function loadEvents() {
            try {
                let data: Event[] = []

                if (isOwnerView && clubId && clubId !== "default") {
                    const ownerData = await getOwnerEvents(clubId, 10)
                    data = ownerData || []
                } else if (isMemberView && userId) {
                    const memberData = await getDashboardEvents(userId, 10)
                    data = memberData || []
                }

                console.log(
                    "All events loaded:",
                    data.map((event) => ({
                        title: event.title,
                        date: event.date,
                        time: event.time,
                        duration: event.duration,
                    })),
                )

                // Filter for active events
                const activeEvents = data.filter((event) => {
                    const eventDate = new Date(event.date)
                    const eventDuration = event.duration || 60 // Default to 60 minutes if not specified
                    const isActive = isEventActive(eventDate, event.time, eventDuration)

                    console.log("Filtering event:", {
                        title: event.title,
                        date: event.date,
                        time: event.time,
                        duration: eventDuration,
                        isActive,
                    })

                    return isActive
                })

                console.log("Active events found:", activeEvents.length)
                setEvents(activeEvents)
            } catch (error) {
                console.error("Failed to load active events:", error)
            } finally {
                setLoading(false)
            }
        }

        loadEvents()

        // Refresh every 30 seconds to update active status more frequently
        const interval = setInterval(loadEvents, 30000)
        return () => clearInterval(interval)
    }, [clubId, userId, isOwnerView, isMemberView])

    const handleRSVP = async (eventId: string, isRegistered: boolean) => {
        if (isOwnerView) return // Owners don't register for their own events

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
            <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/20 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Active Events
                    </CardTitle>
                    <CardDescription className="text-green-200">Loading...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (events.length === 0) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        Active Events
                    </CardTitle>
                    <CardDescription className="text-white/60">No events currently active</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/20 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Active Events ({events.length})
                </CardTitle>
                <CardDescription className="text-green-200">
                    {isOwnerView ? "Events happening right now" : "Events you can join right now"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {events.map((event) => (
                        <div key={event.id} className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{event.title}</h4>
                                    <Badge
                                        className="bg-green-500 text-white border-0 text-xs animate-pulse">LIVE</Badge>
                                    {isMemberView && event.isRegistered && (
                                        <Badge className="bg-blue-500 text-white border-0 text-xs">Registered</Badge>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1 text-sm text-green-100">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4"/>
                                    <span>
                    {event.time}
                                        {isMemberView && event.clubName && ` • ${event.clubName}`}
                  </span>
                                </div>

                                {event.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4"/>
                                        <span>{event.location}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4"/>
                                        <span>{event.registrationCount} registered</span>
                                    </div>
                                    {isOwnerView && event.attendanceCount !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4"/>
                                            <span>{event.attendanceCount} present</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3">
                                {isOwnerView ? (
                                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" asChild>
                                        <Link href={`/dashboard/clubs/${clubId}/events/${event.id}/attendance`}>Mark
                                            Attendance</Link>
                                    </Button>
                                ) : (
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
                                                    {actionLoading === event.id ? "..." : "Cancel"}
                                                </Button>
                                                <div
                                                    className="flex items-center gap-1 px-3 py-1 bg-green-500/30 rounded text-xs">
                                                    <UserCheck className="h-3 w-3"/>
                                                    <span>Ready for attendance</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
