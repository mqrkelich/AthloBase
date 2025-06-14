import {ArrowRight, Calendar, ChevronRight, Clock, MapPin, Users, CheckCircle2} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"

export function DashboardEventsList() {
    // Mock data for events
    const events = [
        {
            id: "event-1",
            date: {day: 12, month: "JUN"},
            title: "Weekly Track Practice",
            club: {name: "City Runners", color: "emerald"},
            type: "Training",
            time: "6:00 PM - 8:00 PM",
            location: "Central Park Track",
            attendees: 18,
            status: "upcoming", // upcoming, ongoing, completed
        },
        {
            id: "event-2",
            date: {day: 14, month: "JUN"},
            title: "League Match vs. Eastside Ballers",
            club: {name: "Metro Basketball", color: "orange"},
            type: "Game",
            time: "7:30 PM - 9:30 PM",
            location: "Downtown Sports Center",
            attendees: 12,
            status: "ongoing",
        },
        {
            id: "event-3",
            date: {day: 16, month: "JUN"},
            title: "Monthly Team Dinner",
            club: {name: "City Runners", color: "emerald"},
            type: "Social",
            time: "7:00 PM - 10:00 PM",
            location: "Riverside Grill",
            attendees: 22,
            status: "upcoming",
        },
    ]

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription className="text-white/60">Your scheduled events for the next 7
                        days</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                    <Link href="/dashboard/events">
                        View All <ArrowRight className="h-4 w-4"/>
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-start gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <div
                                className={`flex flex-col items-center justify-center bg-${event.club.color}-500/20 text-${event.club.color}-500 h-14 w-14 rounded-lg`}
                            >
                                <span className="text-lg font-bold">{event.date.day}</span>
                                <span className="text-xs">{event.date.month}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`bg-${event.club.color}-500/20 text-${event.club.color}-500 border-0`}
                                    >
                                        {event.club.name}
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/10 text-white/80 border-0">
                                        {event.type}
                                    </Badge>
                                    {event.status === "ongoing" && (
                                        <Badge variant="outline"
                                               className="bg-green-500/20 text-green-500 border-0 animate-pulse">
                                            Ongoing Now
                                        </Badge>
                                    )}
                                </div>
                                <h4 className="font-medium mt-1">{event.title}</h4>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-white/60">
                                    <div className="flex items-center">
                                        <Clock className="mr-1 h-3.5 w-3.5"/>
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="mr-1 h-3.5 w-3.5"/>
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="mr-1 h-3.5 w-3.5"/>
                                        <span>{event.attendees} attending</span>
                                    </div>
                                </div>
                            </div>
                            {event.status === "ongoing" ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                    asChild
                                >
                                    <Link href={`/dashboard/events/${event.id}/attendance`}>
                                        <CheckCircle2 className="mr-1 h-4 w-4"/>
                                        Mark Attendance
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                                    <Link href={`/dashboard/events/${event.id}`}>
                                        <ChevronRight className="h-5 w-5"/>
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5" asChild>
                    <Link href="/dashboard/events">
                        <Calendar className="mr-2 h-4 w-4"/>
                        View Full Calendar
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
