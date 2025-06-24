import {getEventDetails} from "@/app/dashboard/clubs/_actions/events"
import {AttendanceManager} from "./_components/attendance-manager"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {CalendarDays, Clock, MapPin, Users} from "lucide-react"
import {notFound} from "next/navigation"
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";

interface AttendancePageProps {
    params: {
        clubId: string
        eventId: string
    }
}

export default async function AttendancePage({params}: AttendancePageProps) {
    const event = await getEventDetails(params.eventId)

    if (!event || !event.canMarkAttendance) {
        notFound()
    }

    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!user) return notFound();

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{event.title} - Attendance</h1>
                    <p className="text-muted-foreground">Mark attendance for registered members</p>
                </div>
                <Badge variant={event.status === "completed" ? "default" : "secondary"}>{event.status}</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                    <CardDescription>Overview of the event information</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground"/>
                        <span className="text-sm">{event.registrations.length} registered</span>
                    </div>
                </CardContent>
            </Card>

            <AttendanceManager userId={user.id} eventId={params.eventId} registrations={event.registrations}
                               attendances={event.attendances}/>
        </div>
    )
}
