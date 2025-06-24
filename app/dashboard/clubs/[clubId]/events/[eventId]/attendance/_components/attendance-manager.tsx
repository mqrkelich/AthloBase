"use client"

import {useState, useTransition} from "react"
import {markAttendance} from "@/app/dashboard/clubs/_actions/events"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {toast} from "sonner"
import {Check, X, Clock, User} from "lucide-react"

interface Registration {
    id: string
    userId: string
    status: string
    user: {
        id: string
        name: string | null
        image: string | null
        email: string | null
    }
}

interface Attendance {
    id: string
    userId: string
    status: string
    checkedInAt: Date
    user: {
        id: string
        name: string | null
        image: string | null
    }
}

interface AttendanceManagerProps {
    eventId: string
    registrations: Registration[]
    attendances: Attendance[]
    userId: string
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
}

export function AttendanceManager({
                                      eventId,
                                      registrations,
                                      attendances: initialAttendances,
                                      userId
                                  }: AttendanceManagerProps) {
    const [attendances, setAttendances] = useState(initialAttendances)
    const [isPending, startTransition] = useTransition()

    const handleMarkAttendance = async (userId: string, status: "present" | "absent") => {
        startTransition(async () => {
            try {
                const result = await markAttendance(eventId, userId, status)

                if (result.error) {
                    toast.error(result.error)
                    return
                }

                // Update local state
                setAttendances((prev) => {
                    const existing = prev.find((att) => att.userId === userId)
                    const user = registrations.find((reg) => reg.userId === userId)?.user

                    if (existing) {
                        return prev.map((att) => (att.userId === userId ? {
                            ...att,
                            status,
                            checkedInAt: new Date()
                        } : att))
                    } else if (user) {
                        return [
                            ...prev,
                            {
                                id: `temp-${userId}`,
                                userId,
                                status,
                                checkedInAt: new Date(),
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    image: user.image,
                                },
                            },
                        ]
                    }
                    return prev
                })

                toast.success(`Attendance marked as ${status}`)
            } catch (error) {
                toast.error("Failed to mark attendance")
            }
        })
    }

    const getAttendanceStatus = (userId: string) => {
        const attendance = attendances.find((att) => att.userId === userId)
        return attendance?.status || "not_marked"
    }

    const getAttendanceStats = () => {
        const present = attendances.filter((att) => att.status === "present").length
        const absent = attendances.filter((att) => att.status === "absent").length
        const notMarked = registrations.length - present - absent

        return {present, absent, notMarked}
    }

    const stats = getAttendanceStats()

    return (
        <div className="space-y-6">
            {/* Attendance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Registered</p>
                                <p className="text-2xl font-bold">{registrations.length}</p>
                            </div>
                            <User className="h-8 w-8 text-muted-foreground"/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Present</p>
                                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                            </div>
                            <Check className="h-8 w-8 text-green-600"/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                            </div>
                            <X className="h-8 w-8 text-red-600"/>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Not Marked</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.notMarked}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600"/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance List */}
            <Card>
                <CardHeader>
                    <CardTitle>Mark Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {registrations.map((registration) => {
                            const attendanceStatus = getAttendanceStatus(registration.userId)
                            const user = registration.user

                            return (
                                <div key={registration.id}
                                     className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.image || undefined}/>
                                            <AvatarFallback>{getInitials(user.name || "")}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name || "Unknown User"}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {attendanceStatus !== "not_marked" && (
                                            <Badge
                                                variant={
                                                    attendanceStatus === "present"
                                                        ? "default"
                                                        : attendanceStatus === "absent"
                                                            ? "destructive"
                                                            : "secondary"
                                                }
                                            >
                                                {attendanceStatus === "present"
                                                    ? "Present"
                                                    : attendanceStatus === "absent"
                                                        ? "Absent"
                                                        : "Not Marked"}
                                            </Badge>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant={attendanceStatus === "present" ? "default" : "outline"}
                                                onClick={() => handleMarkAttendance(registration.userId, "present")}
                                                disabled={isPending}
                                            >
                                                <Check className="h-4 w-4 mr-1"/>
                                                Present
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={attendanceStatus === "absent" ? "destructive" : "outline"}
                                                onClick={() => handleMarkAttendance(registration.userId, "absent")}
                                                disabled={isPending}
                                            >
                                                <X className="h-4 w-4 mr-1"/>
                                                Absent
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {registrations.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">No members registered for this
                                event</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions for Test Users */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Test Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            onClick={() => {


                                handleMarkAttendance(userId, "present")

                            }}
                            disabled={isPending}
                        >
                            Mark Present
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                // Mark all registered users as present
                                registrations.forEach((reg) => {
                                    handleMarkAttendance(reg.userId, "present")
                                })
                            }}
                            disabled={isPending}
                        >
                            Mark All Present
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                // Mark all registered users as absent
                                registrations.forEach((reg) => {
                                    handleMarkAttendance(reg.userId, "absent")
                                })
                            }}
                            disabled={isPending}
                        >
                            Mark All Absent
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
