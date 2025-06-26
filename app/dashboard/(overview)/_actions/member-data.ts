"use server"

import {db} from "@/lib/db"
import {getCurrentUser} from "@/lib/helper/session"
import {getUserById} from "@/data/user"

export async function getMemberProfile(memberId: string, clubId: string) {
    const session = await getCurrentUser()
    if (!session) throw new Error("Unauthorized")

    const user = await getUserById(session.id!)
    if (!user) throw new Error("User not found")

    // Verify user is club owner
    const club = await db.club.findFirst({
        where: {
            id: clubId,
            clubOwnerId: user.id,
        },
    })

    if (!club) throw new Error("Club not found or unauthorized")

    // Get member details
    const member = await db.user.findUnique({
        where: {id: memberId},
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
        },
    })

    if (!member) throw new Error("Member not found")

    // Get club membership info
    const membership = await db.clubMembers.findUnique({
        where: {
            userId_clubId: {
                userId: memberId,
                clubId: clubId,
            },
        },
    })

    if (!membership) throw new Error("Member not in club")

    // Get all club events (past events only for accurate calculations)
    const allClubEvents = await db.event.findMany({
        where: {
            clubId: clubId,
            date: {
                lte: new Date(), // Only past events
            },
        },
        select: {
            id: true,
            type: true,
            date: true,
            title: true,
        },
        orderBy: {
            date: "desc",
        },
    })

    const eventIds = allClubEvents.map((e) => e.id)

    // Get registrations and attendances
    const registrations = await db.eventRegistration.findMany({
        where: {
            userId: memberId,
            eventId: {in: eventIds},
        },
    })

    const attendances = await db.eventAttendance.findMany({
        where: {
            userId: memberId,
            eventId: {in: eventIds},
        },
        include: {
            event: {
                select: {
                    title: true,
                    date: true,
                    type: true,
                },
            },
        },
        orderBy: {
            event: {
                date: "desc",
            },
        },
    })

    // Calculate attendance rate based on registered events
    const attendedEvents = attendances.filter((a) => a.status === "present")
    const attendanceRate = registrations.length > 0 ? Math.round((attendedEvents.length / registrations.length) * 100) : 0

    // Calculate proper consecutive attendance streak
    let currentStreak = 0

    // Get events the member was registered for, sorted by date (most recent first)
    const registeredEventIds = registrations.map((r) => r.eventId)
    const registeredEvents = allClubEvents
        .filter((event) => registeredEventIds.includes(event.id))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Calculate streak by checking consecutive attended events from most recent
    for (const event of registeredEvents) {
        const attendance = attendances.find((a) => a.eventId === event.id)

        if (attendance && attendance.status === "present") {
            currentStreak++
        } else {
            // Break streak if event was missed or not attended
            break
        }
    }

    // Find favorite event type based on attended events
    const attendedEventTypes = attendedEvents.map((a) => a.event.type)
    const eventTypeCounts = attendedEventTypes.reduce(
        (acc, type) => {
            acc[type] = (acc[type] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const favoriteEventType = Object.entries(eventTypeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "training"

    // Generate achievements based on actual performance
    const achievements = []
    if (attendanceRate >= 95 && registrations.length >= 5) achievements.push("Perfect Attendance")
    if (attendedEvents.length >= 10) achievements.push("Regular Attendee")
    if (currentStreak >= 5) achievements.push("On Fire!")
    if (membership.createdAt < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) achievements.push("Veteran Member")

    // Get recent activity (last 5 events the member was registered for)
    const recentActivity = registeredEvents.slice(0, 5).map((event) => {
        const attendance = attendances.find((a) => a.eventId === event.id)
        return {
            eventName: event.title,
            date: event.date.toISOString(),
            type: event.type,
            attended: attendance?.status === "present" || false,
        }
    })

    return {
        id: member.id,
        name: member.name || "Unknown User",
        email: member.email,
        avatar: member.image,
        role: membership.role,
        joinedAt: membership.createdAt.toISOString(),
        lastActive: new Date().toISOString(), // Would need activity tracking
        attendanceRate,
        eventsAttended: attendedEvents.length,
        totalEvents: registrations.length,
        streak: currentStreak,
        favoriteEventType,
        achievements,
        recentActivity,
    }
}

export async function getMemberAttendance(memberId: string, clubId: string) {
    const session = await getCurrentUser()
    if (!session) throw new Error("Unauthorized")

    const user = await getUserById(session.id!)
    if (!user) throw new Error("User not found")

    // Verify user is club owner
    const club = await db.club.findFirst({
        where: {
            id: clubId,
            clubOwnerId: user.id,
        },
    })

    if (!club) throw new Error("Club not found or unauthorized")

    // Get member details
    const member = await db.user.findUnique({
        where: {id: memberId},
        select: {
            id: true,
            name: true,
            image: true,
        },
    })

    if (!member) throw new Error("Member not found")

    // Get all club events
    const clubEvents = await db.event.findMany({
        where: {clubId: clubId},
        select: {
            id: true,
            title: true,
            type: true,
            date: true,
            time: true,
            location: true,
        },
        orderBy: {date: "desc"},
    })

    const eventIds = clubEvents.map((e) => e.id)

    // Get all registrations for this member
    const registrations = await db.eventRegistration.findMany({
        where: {
            userId: memberId,
            eventId: {in: eventIds},
        },
    })

    // Get all attendances for this member
    const attendances = await db.eventAttendance.findMany({
        where: {
            userId: memberId,
            eventId: {in: eventIds},
        },
    })

    // Create attendance records only for events the member was registered for
    const registeredEventIds = registrations.map((r) => r.eventId)
    const attendanceRecords = clubEvents
        .filter((event) => registeredEventIds.includes(event.id))
        .map((event) => {
            const attendance = attendances.find((a) => a.eventId === event.id)

            return {
                eventId: event.id,
                eventName: event.title,
                eventType: event.type,
                date: event.date.toISOString(),
                time: event.time,
                location: event.location,
                attended: attendance?.status === "present" || false,
                checkedInAt: attendance?.checkedInAt?.toISOString(),
            }
        })

    // Calculate stats based on registered events only
    const totalEvents = registrations.length
    const attended = attendances.filter((a) => a.status === "present").length
    const missed = totalEvents - attended
    const attendanceRate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : 0

    // Calculate current streak (consecutive attended events from most recent)
    let currentStreak = 0
    const sortedRecords = attendanceRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    for (const record of sortedRecords) {
        if (record.attended) {
            currentStreak++
        } else {
            break
        }
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0

    // Sort by date ascending to calculate longest streak properly
    const chronologicalRecords = [...sortedRecords].reverse()

    for (const record of chronologicalRecords) {
        if (record.attended) {
            tempStreak++
            longestStreak = Math.max(longestStreak, tempStreak)
        } else {
            tempStreak = 0
        }
    }

    // Calculate recent trend (last 5 events vs previous 5 events)
    const recent5 = sortedRecords.slice(0, 5)
    const previous5 = sortedRecords.slice(5, 10)

    const recentAttendanceRate = recent5.length > 0 ? recent5.filter((r) => r.attended).length / recent5.length : 0
    const previousAttendanceRate =
        previous5.length > 0 ? previous5.filter((r) => r.attended).length / previous5.length : 0

    let recentTrend: "up" | "down" | "stable" = "stable"
    if (recentAttendanceRate > previousAttendanceRate + 0.1) recentTrend = "up"
    else if (recentAttendanceRate < previousAttendanceRate - 0.1) recentTrend = "down"

    return {
        member: {
            id: member.id,
            name: member.name || "Unknown User",
            avatar: member.image,
        },
        stats: {
            totalEvents,
            attended,
            missed,
            attendanceRate,
            streak: currentStreak,
            longestStreak,
            recentTrend,
        },
        records: attendanceRecords.slice(0, 20), // Limit to recent 20 events
    }
}
