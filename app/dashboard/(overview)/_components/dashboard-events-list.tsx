"use client"

import {useEffect, useState} from "react"
import {Calendar, MapPin, Users, Clock} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {getOwnerEvents} from "@/app/dashboard/(overview)/_actions/dashboard-data"

function isEventActive(eventDate: Date, eventTime: string, duration = 120): boolean {
    const now = new Date()

    // Create event start time
    const [hours, minutes] = eventTime.split(":").map(Number)
    const eventStart = new Date(eventDate)
    eventStart.setHours(hours, minutes, 0, 0)

    // Calculate event end time
    const eventEnd = new Date(eventStart.getTime() + duration * 60 * 1000)

    // Debug logging
    console.log("Event Active Check:", {
        now: now.toISOString(),
        eventDate: eventDate.toISOString(),
        eventTime,
        eventStart: eventStart.toISOString(),
        eventEnd: eventEnd.toISOString(),
        duration,
        isActive: now >= eventStart && now <= eventEnd,
    })

    // Check if current time is within event duration
    return now >= eventStart && now <= eventEnd
}

interface DashboardEventsListProps {
    clubId?: string
}

interface Event {
    id: string
    title: string
    description: string | null
    date: Date
    time: string
    location: string | null
    registrationCount: number
    attendanceCount: number
    capacity: number | null
    duration?: number // Add duration field
}

export function DashboardEventsList({clubId}: DashboardEventsListProps) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadEvents() {
            try {
                if (clubId && clubId !== "default") {
                    const data = await getOwnerEvents(clubId, 5)
                    setEvents(data || []) // Handle null case
                }
            } catch (error) {
                console.error("Failed to load events:", error)
            } finally {
                setLoading(false)
            }
        }

        loadEvents()
    }, [clubId])

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription className="text-white/60">No upcoming events</CardDescription>
                    </div>
                    <Button size="sm" asChild>
                        <Link href={`/dashboard/clubs/${clubId}?tab=events`}>Create Event</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-white/60">Create your first event to get started!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription className="text-white/60">Your scheduled events</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/clubs/${clubId}?tab=events`}>View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.map((event) => {
                        const eventDate = new Date(event.date)
                        const isActive = isEventActive(eventDate, event.time, event.duration)

                        console.log("Event processing:", {
                            title: event.title,
                            originalDate: event.date,
                            parsedDate: eventDate.toISOString(),
                            time: event.time,
                            duration: event.duration,
                            isActive,
                        })

                        return (
                            <div
                                key={event.id}
                                className={`p-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "bg-green-500/20 border border-green-500/30 hover:bg-green-500/30"
                                        : "bg-white/5 hover:bg-white/10"
                                }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{event.title}</h4>
                                        {isActive &&
                                            <Badge className="bg-green-500 text-white border-0 text-xs">LIVE</Badge>}
                                    </div>
                                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-0">
                                        {event.registrationCount} registered
                                    </Badge>
                                </div>

                                <div className="space-y-1 text-sm text-white/60">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4"/>
                                        <span>
                      {event.date.toLocaleDateString()} at {event.time}
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

                                        {event.capacity && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4"/>
                                                <span>{event.capacity - event.registrationCount} spots left</span>
                                            </div>
                                        )}
                                    </div>

                                    {isActive && (
                                        <div className="mt-3 pt-2 border-t border-white/10">
                                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700"
                                                    asChild>
                                                <Link href={`/dashboard/clubs/${clubId}/events/${event.id}/attendance`}>Mark
                                                    Attendance</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
