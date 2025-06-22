"use server"

import {z} from "zod"
import {db} from "@/lib/db"
import {getCurrentUser} from "@/lib/helper/session"
import {getUserById} from "@/data/user"

const eventSchema = z.object({
    clubId: z.string(),
    title: z.string(),
    type: z.string(),
    date: z.string(),
    time: z.string(),
    duration: z.number(),
    location: z.string(),
    maxAttendees: z.number(),
    description: z.string().optional(),
    recurring: z.string(),
    coach: z.string().optional(),
})

export async function createEvent(data: z.infer<typeof eventSchema>) {
    const parsed = eventSchema.safeParse(data)
    if (!parsed.success) {
        return {error: parsed.error.errors[0].message || "Invalid event data"}
    }

    const session = await getCurrentUser()
    if (!session) return {error: "Unauthorized!"}

    const dbUser = await getUserById(session.id!)
    if (!dbUser) return {error: "User not found."}

    const club = await db.club.findUnique({
        where: {id: parsed.data.clubId},
    })

    if (!club) return {error: "Club not found"}
    if (club.clubOwnerId !== dbUser.id) return {error: "You are not authorized to create events for this club"}

    const {clubId, title, type, date, time, duration, location, maxAttendees, description, recurring, coach} =
        parsed.data

    await db.event.create({
        data: {
            clubId,
            title,
            type,
            date: new Date(date),
            time,
            duration,
            location,
            maxAttendees,
            description,
            recurring,
            coach,
            status: "scheduled",
        },
    })

    await db.club.update({
        where: {id: clubId},
        data: {
            totalEvents: {
                increment: 1,
            },
            activeEvents: {
                increment: 1,
            },
        },
    })

    return {success: "Event created successfully."}
}

export async function deleteEvent(clubId: string, eventId: string) {
    const session = await getCurrentUser()
    if (!session) {
        return {error: "Unauthorized!"}
    }

    const dbUser = await getUserById(session.id!)
    if (!dbUser) {
        return {error: "User not found."}
    }

    const club = await db.club.findUnique({
        where: {id: clubId},
    })
    if (!club) {
        return {error: "Club not found"}
    }

    if (club.clubOwnerId !== dbUser.id) {
        return {error: "You are not authorized to delete events for this club"}
    }

    const event = await db.event.findUnique({
        where: {id: eventId},
    })

    if (!event) {
        return {error: "Event not found"}
    }

    // Delete the event (this will cascade delete registrations and attendances)
    await db.event.delete({
        where: {id: eventId},
    })

    // Update the club's active events count
    await db.club.update({
        where: {id: clubId},
        data: {
            activeEvents: {
                decrement: 1,
            },
        },
    })

    return {success: "Event deleted successfully."}
}

export async function getEventsByClub(clubId: string) {
    const session = await getCurrentUser()
    if (!session) return []

    const dbUser = await getUserById(session.id!)
    if (!dbUser) return []

    // Check if user is a member of the club or the owner
    const clubMember = await db.clubMembers.findUnique({
        where: {
            userId_clubId: {
                userId: dbUser.id,
                clubId: clubId,
            },
        },
    })

    const club = await db.club.findUnique({
        where: {id: clubId},
    })

    if (!club) return []

    // User must be either the owner or a member
    if (club.clubOwnerId !== dbUser.id && !clubMember) return []

    const events = await db.event.findMany({
        where: {clubId},
        include: {
            registrations: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
            attendances: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: {date: "asc"},
    })

    if (!events || events.length === 0) return []

    return events.map((event) => ({
        id: event.id,
        title: event.title,
        type: capitalize(event.type),
        date: event.date.toISOString().split("T")[0],
        time: event.time,
        duration: event.duration,
        location: event.location,
        attendees: event.registrations.length,
        maxAttendees: event.maxAttendees,
        status: capitalize(event.status),
        recurring: capitalize(event.recurring),
        description: event.description ?? "",
        coach: event.coach ?? "",
        registrations: event.registrations,
        attendances: event.attendances,
        isRegistered: event.registrations.some((reg) => reg.userId === dbUser.id),
        hasAttended: event.attendances.some((att) => att.userId === dbUser.id),
    }))
}

export async function registerForEvent(eventId: string) {
    const session = await getCurrentUser()
    if (!session) return {error: "Unauthorized!"}

    const dbUser = await getUserById(session.id!)
    if (!dbUser) return {error: "User not found."}

    const event = await db.event.findUnique({
        where: {id: eventId},
        include: {
            club: true,
            registrations: true,
        },
    })

    if (!event) return {error: "Event not found"}

    // Check if user is a member of the club
    const clubMember = await db.clubMembers.findUnique({
        where: {
            userId_clubId: {
                userId: dbUser.id,
                clubId: event.clubId,
            },
        },
    })

    if (!clubMember && event.club.clubOwnerId !== dbUser.id) {
        return {error: "You must be a member of this club to register for events"}
    }

    // Check if already registered
    const existingRegistration = await db.eventRegistration.findUnique({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: dbUser.id,
            },
        },
    })

    if (existingRegistration) {
        return {error: "You are already registered for this event"}
    }

    // Check if event is full
    if (event.registrations.length >= event.maxAttendees) {
        return {error: "This event is full"}
    }

    // Register for the event
    await db.eventRegistration.create({
        data: {
            eventId: eventId,
            userId: dbUser.id,
            status: "registered",
        },
    })

    // Update event attendees count
    await db.event.update({
        where: {id: eventId},
        data: {
            attendees: {
                increment: 1,
            },
        },
    })

    return {success: "Successfully registered for event!"}
}

export async function unregisterFromEvent(eventId: string) {
    const session = await getCurrentUser()
    if (!session) return {error: "Unauthorized!"}

    const dbUser = await getUserById(session.id!)
    if (!dbUser) return {error: "User not found."}

    const registration = await db.eventRegistration.findUnique({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: dbUser.id,
            },
        },
    })

    if (!registration) {
        return {error: "You are not registered for this event"}
    }

    // Remove registration
    await db.eventRegistration.delete({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: dbUser.id,
            },
        },
    })

    // Update event attendees count
    await db.event.update({
        where: {id: eventId},
        data: {
            attendees: {
                decrement: 1,
            },
        },
    })

    return {success: "Successfully unregistered from event!"}
}

export async function markAttendance(eventId: string, userId: string, status = "present") {
    const session = await getCurrentUser()
    if (!session) return {error: "Unauthorized!"}

    const dbUser = await getUserById(session.id!)
    if (!dbUser) return {error: "User not found."}

    const event = await db.event.findUnique({
        where: {id: eventId},
        include: {
            club: true,
        },
    })

    if (!event) return {error: "Event not found"}

    // Only club owners/coaches can mark attendance
    if (event.club.clubOwnerId !== dbUser.id) {
        return {error: "You are not authorized to mark attendance for this event"}
    }

    // Check if user is registered for the event
    const registration = await db.eventRegistration.findUnique({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: userId,
            },
        },
    })

    if (!registration) {
        return {error: "User is not registered for this event"}
    }

    // Create or update attendance record
    await db.eventAttendance.upsert({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: userId,
            },
        },
        update: {
            status: status,
            checkedInAt: new Date(),
            checkedInBy: dbUser.id,
        },
        create: {
            eventId: eventId,
            userId: userId,
            status: status,
            checkedInBy: dbUser.id,
        },
    })

    return {success: "Attendance marked successfully!"}
}

export async function getEventDetails(eventId: string) {
    const session = await getCurrentUser()
    if (!session) return null

    const dbUser = await getUserById(session.id!)
    if (!dbUser) return null

    const event = await db.event.findUnique({
        where: {id: eventId},
        include: {
            club: true,
            registrations: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            email: true,
                        },
                    },
                },
            },
            attendances: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    })

    if (!event) return null

    // Check if user has access to this event
    const clubMember = await db.clubMembers.findUnique({
        where: {
            userId_clubId: {
                userId: dbUser.id,
                clubId: event.clubId,
            },
        },
    })

    if (event.club.clubOwnerId !== dbUser.id && !clubMember) {
        return null
    }

    return {
        ...event,
        isRegistered: event.registrations.some((reg) => reg.userId === dbUser.id),
        hasAttended: event.attendances.some((att) => att.userId === dbUser.id),
        canMarkAttendance: event.club.clubOwnerId === dbUser.id,
    }
}

export async function getMemberEventStats(clubId: string, userId?: string) {
    const session = await getCurrentUser()
    if (!session) return null

    const dbUser = await getUserById(session.id!)
    if (!dbUser) return null

    const targetUserId = userId || dbUser.id

    // Check if user has access to this club
    const clubMember = await db.clubMembers.findUnique({
        where: {
            userId_clubId: {
                userId: dbUser.id,
                clubId: clubId,
            },
        },
    })

    const club = await db.club.findUnique({
        where: {id: clubId},
    })

    if (!club) return null

    if (club.clubOwnerId !== dbUser.id && !clubMember) {
        return null
    }

    // Get member's event statistics
    const registrations = await db.eventRegistration.findMany({
        where: {
            userId: targetUserId,
            event: {
                clubId: clubId,
            },
        },
        include: {
            event: true,
        },
    })

    const attendances = await db.eventAttendance.findMany({
        where: {
            userId: targetUserId,
            event: {
                clubId: clubId,
            },
        },
        include: {
            event: true,
        },
    })

    const totalRegistrations = registrations.length
    const totalAttendances = attendances.length
    const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttendances / totalRegistrations) * 100) : 0

    const memberInfo = await db.clubMembers.findUnique({
        where: {
            userId_clubId: {
                userId: targetUserId,
                clubId: clubId,
            },
        },
    })

    return {
        eventsRegistered: totalRegistrations,
        eventsAttended: totalAttendances,
        attendanceRate: attendanceRate,
        memberSince: memberInfo?.createdAt || new Date(),
        recentEvents: registrations.slice(-5).map((reg) => ({
            id: reg.event.id,
            title: reg.event.title,
            date: reg.event.date,
            attended: attendances.some((att) => att.eventId === reg.eventId),
        })),
    }
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
