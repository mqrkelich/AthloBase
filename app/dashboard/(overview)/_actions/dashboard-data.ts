"use server"

import {db} from "@/lib/db"
import {getCurrentUser} from "@/lib/helper/session"
import {getUserById} from "@/data/user"

export async function getOwnerDashboardMetrics(clubId: string) {
    const session = await getCurrentUser()
    if (!session) return null

    const user = await getUserById(session.id!)
    if (!user) return null

    const club = await db.club.findUnique({
        where: {
            id: clubId,
            clubOwnerId: user.id,
        },
        include: {
            clubMembers: {
                where: {
                    status: "active",
                },
            },
            events: {
                where: {
                    date: {
                        gte: new Date(),
                    },
                },
                orderBy: {
                    date: "asc",
                },
            },
            _count: {
                select: {
                    events: true,
                    clubMembers: true,
                },
            },
        },
    })

    if (!club) return null

    // Get member growth for this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const newMembersThisMonth = await db.clubMembers.count({
        where: {
            clubId: clubId,
            createdAt: {
                gte: startOfMonth,
            },
        },
    })

    // Get events created this year
    const startOfYear = new Date()
    startOfYear.setMonth(0, 1)
    startOfYear.setHours(0, 0, 0, 0)

    const eventsThisYear = await db.event.count({
        where: {
            clubId: clubId,
            createdAt: {
                gte: startOfYear,
            },
        },
    })

    // Calculate average attendance
    const eventsWithAttendance = await db.event.findMany({
        where: {
            clubId: clubId,
            date: {
                lt: new Date(), // Past events only
            },
        },
        include: {
            registrations: true,
            attendances: true,
        },
    })

    let totalAttendanceRate = 0
    let eventsWithData = 0

    eventsWithAttendance.forEach((event) => {
        if (event.registrations.length > 0) {
            const rate = (event.attendances.length / event.registrations.length) * 100
            totalAttendanceRate += rate
            eventsWithData++
        }
    })

    const avgAttendance = eventsWithData > 0 ? Math.round(totalAttendanceRate / eventsWithData) : 0

    // Get next event
    const nextEvent = club.events[0]
    const nextEventDate = nextEvent ? `${nextEvent.date.toLocaleDateString()} at ${nextEvent.time}` : "No upcoming events"

    return {
        totalMembers: club._count.clubMembers,
        memberGrowth: newMembersThisMonth,
        upcomingEvents: club.events.length,
        nextEventDate,
        totalEvents: club._count.events,
        eventGrowth: eventsThisYear,
        avgAttendance,
        attendanceChange: 0, // Would need historical data to calculate
    }
}

export async function getMemberDashboardMetrics(userId: string) {
    const session = await getCurrentUser()
    if (!session) return null

    const user = await getUserById(session.id!)
    if (!user || user.id !== userId) return null

    console.log("Getting member dashboard metrics for userId:", userId)

    // Get user's club memberships
    const memberships = await db.clubMembers.findMany({
        where: {
            userId: userId,
            status: "active",
        },
        include: {
            club: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    console.log("Found memberships:", memberships)

    const clubIds = memberships.map((m) => m.clubId)
    const clubNames = memberships.map((m) => m.club.name)

    console.log("Club IDs:", clubIds)

    // Get ALL events from user's clubs first
    const clubEvents = await db.event.findMany({
        where: {
            clubId: {
                in: clubIds,
            },
        },
        select: {
            id: true,
            title: true,
            date: true,
            clubId: true,
        },
    })

    console.log("Found club events:", clubEvents.length)

    const eventIds = clubEvents.map((e) => e.id)

    // Get events attended - Query by eventId being in the user's club events
    const attendances = await db.eventAttendance.findMany({
        where: {
            userId: userId,
            eventId: {
                in: eventIds,
            },
            status: "present", // Make sure we only count present attendances
        },
    })

    console.log("Found attendances:", attendances)

    // Get events attended this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const attendancesThisMonth = attendances.filter((attendance) => {
        const event = clubEvents.find((e) => e.id === attendance.eventId)
        return event && event.date >= startOfMonth
    }).length

    console.log("Attendances this month:", attendancesThisMonth)

    // Get upcoming events count (including currently active events)
    const now = new Date()
    const upcomingEventsCount = await db.event.count({
        where: {
            clubId: {
                in: clubIds,
            },
            OR: [
                {
                    date: {
                        gt: now,
                    },
                },
                {
                    AND: [
                        {
                            date: {
                                gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                            },
                        },
                        {
                            date: {
                                lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                            },
                        },
                    ],
                },
            ],
        },
    })

    // Get next event (including currently active events)
    const nextEvent = await db.event.findFirst({
        where: {
            clubId: {
                in: clubIds,
            },
            OR: [
                {
                    date: {
                        gt: now,
                    },
                },
                {
                    AND: [
                        {
                            date: {
                                gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                            },
                        },
                        {
                            date: {
                                lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                            },
                        },
                    ],
                },
            ],
        },
        orderBy: [
            {
                date: "asc",
            },
            {
                time: "asc",
            },
        ],
    })

    const nextEventDate = nextEvent ? `${nextEvent.date.toLocaleDateString()} at ${nextEvent.time}` : "No upcoming events"

    // Calculate attendance rate - Get registrations for events in user's clubs
    const registrations = await db.eventRegistration.findMany({
        where: {
            userId: userId,
            eventId: {
                in: eventIds,
            },
        },
    })

    console.log("Found registrations:", registrations.length)

    const attendanceRate = registrations.length > 0 ? Math.round((attendances.length / registrations.length) * 100) : 0

    console.log("Calculated attendance rate:", attendanceRate)

    // Get member since date
    const oldestMembership =
        memberships.length > 0
            ? memberships.reduce((oldest, current) => (current.createdAt < oldest.createdAt ? current : oldest))
            : null

    const memberSince = oldestMembership
        ? oldestMembership.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
        })
        : "No memberships found"

    const result = {
        eventsAttended: attendances.length,
        eventsThisMonth: attendancesThisMonth,
        totalClubs: memberships.length,
        clubNames,
        upcomingEvents: upcomingEventsCount,
        nextEventDate,
        attendanceRate,
        memberSince,
    }

    console.log("Final member metrics:", result)

    return result
}

export async function refreshMemberMetrics(userId: string) {
    // This function forces a fresh calculation of member metrics
    // by bypassing any potential caching issues
    return await getMemberDashboardMetrics(userId)
}

export async function getClubMembers(clubId: string, limit = 4) {
    const session = await getCurrentUser()
    if (!session) return []

    const user = await getUserById(session.id!)
    if (!user) return []

    const club = await db.club.findUnique({
        where: {id: clubId},
    })

    if (!club) return []

    // Check if user is owner or member
    const isOwner = club.clubOwnerId === user.id
    const isMember = await db.clubMembers.findUnique({
        where: {
            userId_clubId: {
                userId: user.id,
                clubId: clubId,
            },
        },
    })

    if (!isOwner && !isMember) return []

    const members = await db.clubMembers.findMany({
        where: {
            clubId: clubId,
            status: "active",
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    })

    // Get club events first
    const clubEvents = await db.event.findMany({
        where: {
            clubId: clubId,
        },
        select: {
            id: true,
        },
    })

    const eventIds = clubEvents.map((e) => e.id)

    // Get attendance data for each member
    const membersWithStats = await Promise.all(
        members.map(async (member) => {
            const registrations = await db.eventRegistration.count({
                where: {
                    userId: member.userId,
                    eventId: {
                        in: eventIds,
                    },
                },
            })

            const attendances = await db.eventAttendance.count({
                where: {
                    userId: member.userId,
                    eventId: {
                        in: eventIds,
                    },
                    status: "present",
                },
            })

            const attendanceRate = registrations > 0 ? Math.round((attendances / registrations) * 100) : 0

            return {
                id: member.user.id,
                name: member.user.name || "Unknown User",
                email: member.user.email,
                avatar: member.user.image ?? null,
                role: member.userId === club.clubOwnerId ? "owner" : member.role,
                joinedAt: member.createdAt.toISOString(),
                lastActive: "Recently", // Placeholder, would need last activity tracking
                attendanceRate,
                eventsAttended: attendances,
            }
        }),
    )

    return membersWithStats
}

export async function getClubPerformanceData(clubId: string) {
    const session = await getCurrentUser()
    if (!session) return null

    const user = await getUserById(session.id!)
    if (!user) return null

    const club = await db.club.findUnique({
        where: {
            id: clubId,
            clubOwnerId: user.id,
        },
    })

    if (!club) return null

    // Get monthly attendance data for the last 6 months
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        const events = await db.event.findMany({
            where: {
                clubId: clubId,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            include: {
                registrations: true,
                attendances: true,
            },
        })

        let totalRegistrations = 0
        let totalAttendances = 0

        events.forEach((event) => {
            totalRegistrations += event.registrations.length
            totalAttendances += event.attendances.length
        })

        const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttendances / totalRegistrations) * 100) : 0

        monthlyData.push({
            month: date.toLocaleDateString("en-US", {month: "short"}),
            attendance: attendanceRate,
            events: events.length,
        })
    }

    // Get top performers
    const members = await db.clubMembers.findMany({
        where: {
            clubId: clubId,
            status: "active",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    // Get club events
    const clubEvents = await db.event.findMany({
        where: {
            clubId: clubId,
        },
        select: {
            id: true,
        },
    })

    const eventIds = clubEvents.map((e) => e.id)

    const topPerformers = await Promise.all(
        members.map(async (member) => {
            const registrations = await db.eventRegistration.count({
                where: {
                    userId: member.userId,
                    eventId: {
                        in: eventIds,
                    },
                },
            })

            const attendances = await db.eventAttendance.count({
                where: {
                    userId: member.userId,
                    eventId: {
                        in: eventIds,
                    },
                    status: "present",
                },
            })

            const attendanceRate = registrations > 0 ? Math.round((attendances / registrations) * 100) : 0

            return {
                name: member.user.name || "Unknown User",
                attendanceRate,
                eventsAttended: attendances,
            }
        }),
    )

    // Sort by attendance rate and take top 3
    const sortedPerformers = topPerformers.sort((a, b) => b.attendanceRate - a.attendanceRate).slice(0, 3)

    // Get club growth data
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const newMembers = await db.clubMembers.count({
        where: {
            clubId: clubId,
            createdAt: {
                gte: startOfMonth,
            },
        },
    })

    const totalMembers = await db.clubMembers.count({
        where: {
            clubId: clubId,
            status: "active",
        },
    })

    const growthRate = totalMembers > 0 ? Math.round((newMembers / totalMembers) * 100) : 0

    return {
        monthlyAttendance: monthlyData,
        topPerformers: sortedPerformers,
        clubGrowth: {
            newMembers,
            totalMembers,
            growthRate,
        },
    }
}

export async function getMemberPerformanceData(userId: string) {
    const session = await getCurrentUser()
    if (!session) return null

    const user = await getUserById(session.id!)
    if (!user || user.id !== userId) return null

    // Get user's clubs
    const memberships = await db.clubMembers.findMany({
        where: {
            userId: userId,
            status: "active",
        },
        include: {
            club: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    const clubIds = memberships.map((m) => m.clubId)

    // Get all events from user's clubs
    const clubEvents = await db.event.findMany({
        where: {
            clubId: {
                in: clubIds,
            },
        },
        select: {
            id: true,
            title: true,
            date: true,
            clubId: true,
        },
    })

    const eventIds = clubEvents.map((e) => e.id)

    // Get monthly performance data
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        const monthEvents = clubEvents.filter((e) => e.date >= startOfMonth && e.date <= endOfMonth)
        const monthEventIds = monthEvents.map((e) => e.id)

        const attendances = await db.eventAttendance.count({
            where: {
                userId: userId,
                eventId: {
                    in: monthEventIds,
                },
                status: "present",
            },
        })

        const registrations = await db.eventRegistration.count({
            where: {
                userId: userId,
                eventId: {
                    in: monthEventIds,
                },
            },
        })

        const attendanceRate = registrations > 0 ? Math.round((attendances / registrations) * 100) : 0

        monthlyData.push({
            month: date.toLocaleDateString("en-US", {month: "short"}),
            attendance: attendanceRate,
            events: attendances,
        })
    }

    // Get recent events
    const recentAttendances = await db.eventAttendance.findMany({
        where: {
            userId: userId,
            eventId: {
                in: eventIds,
            },
            status: "present",
        },
        orderBy: {
            checkedInAt: "desc",
        },
        take: 5,
    })

    const recentEvents = await Promise.all(
        recentAttendances.map(async (attendance) => {
            const event = await db.event.findUnique({
                where: {id: attendance.eventId},
                include: {
                    club: {
                        select: {
                            name: true,
                        },
                    },
                },
            })

            return {
                id: attendance.eventId,
                title: event?.title || "Unknown Event",
                date: event?.date || new Date(),
                clubName: event?.club.name || "Unknown Club",
                attended: true,
            }
        }),
    )

    return {
        monthlyPerformance: monthlyData,
        recentEvents,
        clubs: memberships.map((m) => ({
            id: m.club.id,
            name: m.club.name,
        })),
    }
}

export async function getDashboardEvents(userId: string, limit = 5) {
    try {
        console.log("getDashboardEvents called with:", {userId, limit})

        const session = await getCurrentUser()
        console.log("Session:", session)
        if (!session) {
            console.log("No session found")
            return []
        }

        const user = await getUserById(session.id!)
        console.log("User:", user)
        if (!user || user.id !== userId) {
            console.log("User not found or ID mismatch")
            return []
        }

        // Get user's clubs
        const memberships = await db.clubMembers.findMany({
            where: {
                userId: userId,
            },
            select: {
                clubId: true,
            },
        })
        console.log("User memberships:", memberships)

        const clubIds = memberships.map((m) => m.clubId)
        console.log("Club IDs:", clubIds)

        if (clubIds.length === 0) {
            console.log("No clubs found for user")
            return []
        }

        // Get all events from user's clubs
        const allEvents = await db.event.findMany({
            where: {
                clubId: {
                    in: clubIds,
                },
            },
            include: {
                club: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                registrations: {
                    where: {
                        userId: userId,
                    },
                },
                _count: {
                    select: {
                        registrations: true,
                    },
                },
            },
            orderBy: [
                {
                    date: "asc",
                },
                {
                    time: "asc",
                },
            ],
        })

        console.log("All events from database:", allEvents.length)

        // Filter events to show upcoming AND currently active events
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        console.log("Current time:", now.toISOString())
        console.log("Today date:", today.toISOString())

        const upcomingAndActiveEvents = allEvents
            .filter((event) => {
                const eventDate = new Date(event.date)
                const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

                // If event is on a future date, it's upcoming
                if (eventDateOnly > today) {
                    console.log(`Event "${event.title}" is on future date:`, eventDateOnly.toISOString())
                    return true
                }

                // If event is today, check if it's upcoming OR currently active
                if (eventDateOnly.getTime() === today.getTime()) {
                    const [hours, minutes] = event.time.split(":").map(Number)
                    const eventDateTime = new Date(eventDateOnly)
                    eventDateTime.setHours(hours, minutes, 0, 0)

                    // Calculate event end time (start time + duration)
                    const eventEndTime = new Date(eventDateTime.getTime() + (event.duration || 60) * 60 * 1000)

                    const isUpcoming = eventDateTime > now
                    const isCurrentlyActive = now >= eventDateTime && now <= eventEndTime

                    console.log(`Event "${event.title}" is today:`, {
                        eventTime: event.time,
                        eventDateTime: eventDateTime.toISOString(),
                        eventEndTime: eventEndTime.toISOString(),
                        now: now.toISOString(),
                        duration: event.duration,
                        isUpcoming,
                        isCurrentlyActive,
                        shouldShow: isUpcoming || isCurrentlyActive,
                    })

                    return isUpcoming || isCurrentlyActive
                }

                // Event is in the past
                console.log(`Event "${event.title}" is in the past:`, eventDateOnly.toISOString())
                return false
            })
            .slice(0, limit)

        console.log("Filtered upcoming and active events:", upcomingAndActiveEvents.length)

        const mappedEvents = upcomingAndActiveEvents.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            clubName: event.club.name,
            clubId: event.club.id,
            isRegistered: event.registrations.length > 0,
            registrationCount: event._count.registrations,
            capacity: event.maxAttendees,
            duration: event.duration || 60,
        }))

        console.log("Final mapped events:", mappedEvents)
        return mappedEvents
    } catch (error) {
        console.error("Error fetching dashboard events:", error)
        return []
    }
}

export async function getOwnerEvents(clubId: string, limit = 5) {
    try {
        console.log("getOwnerEvents called with:", {clubId, limit})

        const session = await getCurrentUser()
        console.log("Session:", session)
        if (!session) {
            console.log("No session found")
            return null
        }

        const user = await getUserById(session.id!)
        console.log("User:", user)
        if (!user) {
            console.log("No user found")
            return []
        }

        // Verify user owns this club
        const club = await db.club.findFirst({
            where: {
                id: clubId,
                clubOwnerId: user.id,
            },
        })
        console.log("Club found:", club)

        if (!club) {
            console.log("No club found or user is not owner")
            return []
        }

        // Get all events for this club
        const allEvents = await db.event.findMany({
            where: {
                clubId: clubId,
            },
            include: {
                _count: {
                    select: {
                        registrations: true,
                        attendances: true,
                    },
                },
            },
            orderBy: [
                {
                    date: "asc",
                },
                {
                    time: "asc",
                },
            ],
        })

        console.log("All events from database:", allEvents.length)

        // Filter events to show upcoming AND currently active events
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        console.log("Current time:", now.toISOString())
        console.log("Today date:", today.toISOString())

        const upcomingAndActiveEvents = allEvents
            .filter((event) => {
                const eventDate = new Date(event.date)
                const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())

                // If event is on a future date, it's upcoming
                if (eventDateOnly > today) {
                    console.log(`Owner Event "${event.title}" is on future date:`, eventDateOnly.toISOString())
                    return true
                }

                // If event is today, check if it's upcoming OR currently active
                if (eventDateOnly.getTime() === today.getTime()) {
                    const [hours, minutes] = event.time.split(":").map(Number)
                    const eventDateTime = new Date(eventDateOnly)
                    eventDateTime.setHours(hours, minutes, 0, 0)

                    // Calculate event end time (start time + duration)
                    const eventEndTime = new Date(eventDateTime.getTime() + (event.duration || 60) * 60 * 1000)

                    const isUpcoming = eventDateTime > now
                    const isCurrentlyActive = now >= eventDateTime && now <= eventEndTime

                    console.log(`Owner Event "${event.title}" is today:`, {
                        eventTime: event.time,
                        eventDateTime: eventDateTime.toISOString(),
                        eventEndTime: eventEndTime.toISOString(),
                        now: now.toISOString(),
                        duration: event.duration,
                        isUpcoming,
                        isCurrentlyActive,
                        shouldShow: isUpcoming || isCurrentlyActive,
                    })

                    return isUpcoming || isCurrentlyActive
                }

                // Event is in the past
                console.log(`Owner Event "${event.title}" is in the past:`, eventDateOnly.toISOString())
                return false
            })
            .slice(0, limit)

        console.log("Filtered upcoming and active events:", upcomingAndActiveEvents.length)

        const mappedEvents = upcomingAndActiveEvents.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            registrationCount: event._count.registrations,
            attendanceCount: event._count.attendances,
            capacity: event.maxAttendees,
            duration: event.duration || 60,
        }))

        console.log("Final mapped events:", mappedEvents)
        return mappedEvents
    } catch (error) {
        console.error("Error fetching owner events:", error)
        return []
    }
}
