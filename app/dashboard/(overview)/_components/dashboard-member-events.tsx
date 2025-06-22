"use client"

import {useEffect, useState} from "react"
import {Calendar, MapPin, Users, CheckCircle} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {getDashboardEvents} from "@/app/dashboard/(overview)/_actions/dashboard-data"

interface DashboardMemberEventsProps {
    userId?: string
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
}

export function DashboardMemberEvents({userId}: DashboardMemberEventsProps) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadEvents() {
            try {
                if (userId) {
                    const data = await getDashboardEvents(userId, 5)
                    setEvents(data)
                }
            } catch (error) {
                console.error("Failed to load member events:", error)
            } finally {
                setLoading(false)
            }
        }

        loadEvents()
    }, [userId])

    if (!userId) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription className="text-white/60">Please log in to view events</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription className="text-white/60">Loading your events...</CardDescription>
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
                        <Link href="/dashboard/discover">Discover Events</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-white/60">Join a club to see upcoming events!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription className="text-white/60">Events from your clubs</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/events">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-medium">{event.title}</h4>
                                    <p className="text-xs text-white/60">{event.clubName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {event.isRegistered && (
                                        <Badge variant="outline"
                                               className="bg-emerald-500/20 text-emerald-500 border-0">
                                            <CheckCircle className="h-3 w-3 mr-1"/>
                                            Registered
                                        </Badge>
                                    )}
                                </div>
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
                                        <span
                                            className="text-xs">{event.capacity - event.registrationCount} spots left</span>
                                    )}
                                </div>
                            </div>

                            {!event.isRegistered && (
                                <div className="mt-3">
                                    <Button size="sm" className="w-full">
                                        Register for Event
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
