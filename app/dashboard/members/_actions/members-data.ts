"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/helper/session"
import { getUserById } from "@/data/user"

interface Member {
  id: string
  name: string
  email: string | null
  image: string | null
  role: string
  joinedAt: string
  lastActive: string
  attendanceRate: number
  eventsAttended: number
  clubId: string
  clubName: string
  clubLogo: string | null
}

interface Club {
  id: string
  name: string
  logo: string | null
  memberCount: number
}

export async function getAllMembers() {
  try {
    const session = await getCurrentUser()
    if (!session?.id) {
      throw new Error("Unauthorized")
    }

    const user = await getUserById(session.id)
    if (!user) {
      throw new Error("User not found")
    }

    console.log("Fetching members for user:", user.id)

    // Get user's club memberships to determine their role
    const userMemberships = await db.clubMembers.findMany({
      where: { userId: user.id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    })

    // Filter out memberships where club is null (deleted clubs)
    const validUserMemberships = userMemberships.filter((membership) => membership.club !== null)

    if (validUserMemberships.length === 0) {
      return {
        members: [],
        clubs: [],
        userRole: "member" as const,
      }
    }

    // Determine user's highest role across all clubs - convert UserRole enum to string
    const userRole = (validUserMemberships.some((m) => m.role.toString() === "owner") ? "owner" : "member").toUpperCase()

    // Get all club IDs user has access to
    const clubIds = validUserMemberships.map((m) => m.club!.id)

    console.log("User clubs:", clubIds.length)
    console.log("User role:", userRole)


    // Get all members from user's clubs
    const allClubMemberships = await db.clubMembers.findMany({
      where: {
        clubId: { in: clubIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Filter out memberships where user or club is null
    const validMemberships = allClubMemberships.filter(
      (membership) => membership.user !== null && membership.club !== null,
    )

    console.log("Total memberships found:", validMemberships.length)

    // Get event registrations and attendances for all users
    const userIds = [...new Set(validMemberships.map((m) => m.user!.id))]

    let eventRegistrations: any[] = []
    let eventAttendances: any[] = []

    if (userIds.length > 0) {
      // Get event registrations without include first, then join manually
      const allEventRegistrations = await db.eventRegistration.findMany({
        where: { userId: { in: userIds } },
      })

      // Get all events that exist
      const eventIds = [...new Set(allEventRegistrations.map((reg) => reg.eventId))]
      const existingEvents = await db.event.findMany({
        where: { id: { in: eventIds } },
        select: {
          id: true,
          title: true,
          date: true,
          clubId: true,
        },
      })

      // Create a map of events for quick lookup
      const eventMap = new Map(existingEvents.map((event) => [event.id, event]))

      // Filter registrations to only include those with existing events
      eventRegistrations = allEventRegistrations
        .filter((reg) => eventMap.has(reg.eventId))
        .map((reg) => ({
          ...reg,
          event: eventMap.get(reg.eventId)!,
        }))

      // Get event attendances without include first, then join manually
      const allEventAttendances = await db.eventAttendance.findMany({
        where: { userId: { in: userIds } },
      })

      // Filter attendances to only include those with existing events
      eventAttendances = allEventAttendances
        .filter((att) => eventMap.has(att.eventId))
        .map((att) => ({
          ...att,
          event: eventMap.get(att.eventId)!,
        }))
    }

    console.log("Event registrations found:", eventRegistrations.length)
    console.log("Event attendances found:", eventAttendances.length)

    // Calculate statistics for each member
    const members: Member[] = validMemberships.map((membership) => {
      const user = membership.user!
      const club = membership.club!

      // Get user's registrations for this club
      const userRegistrations = eventRegistrations.filter(
        (reg) => reg.userId === user.id && reg.event.clubId === club.id,
      )

      // Get user's attendances for this club
      const userAttendances = eventAttendances.filter(
        (att) => att.userId === user.id && att.event.clubId === club.id && att.status === "present",
      )

      // Calculate attendance rate
      const attendanceRate =
        userRegistrations.length > 0 ? Math.round((userAttendances.length / userRegistrations.length) * 100) : 0

      return {
        id: user.id,
        name: user.name || "Unknown",
        email: user.email,
        image: user.image,
        role: membership.role.toString(), // Convert UserRole enum to string
        joinedAt: membership.createdAt.toISOString(),
        lastActive: user.createdAt.toISOString(), // Using createdAt as placeholder
        attendanceRate,
        eventsAttended: userAttendances.length,
        clubId: club.id,
        clubName: club.name,
        clubLogo: club.logo,
      }
    })

    // Get club statistics
    const clubs: Club[] = validUserMemberships.map((membership) => {
      const club = membership.club!
      const memberCount = validMemberships.filter((m) => m.club!.id === club.id).length

      return {
        id: club.id,
        name: club.name,
        logo: club.logo,
        memberCount,
      }
    })

    // Remove duplicate clubs
    const uniqueClubs = clubs.filter((club, index, self) => index === self.findIndex((c) => c.id === club.id))

    console.log("Final members count:", members.length)
    console.log("Final clubs count:", uniqueClubs.length)

    return {
      members,
      clubs: uniqueClubs,
      userRole,
    }
  } catch (error) {
    console.error("Error fetching members:", error)
    throw new Error("Failed to fetch members")
  }
}

export async function exportMembersData() {
  try {
    const session = await getCurrentUser()
    if (!session?.id) {
      throw new Error("Unauthorized")
    }

    const user = await getUserById(session.id)
    if (!user) {
      throw new Error("User not found")
    }

    // Get all user's memberships first to check for owner role
    const userMemberships = await db.clubMembers.findMany({
      where: { userId: user.id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Filter out memberships where club is null and check for owner role
    const validUserMemberships = userMemberships.filter((membership) => membership.club !== null)
    const ownerMemberships = validUserMemberships.filter((membership) => membership.role.toString() === "owner")

    if (ownerMemberships.length === 0) {
      throw new Error("Only club owners can export member data")
    }

    const ownedClubIds = ownerMemberships.map((m) => m.club!.id)

    // Get all members from owned clubs
    const allMembers = await db.clubMembers.findMany({
      where: {
        clubId: { in: ownedClubIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Filter out null users/clubs
    const validMembers = allMembers.filter((member) => member.user !== null && member.club !== null)

    // Get event data for all members
    const userIds = [...new Set(validMembers.map((m) => m.user!.id))]

    let eventRegistrations: any[] = []
    let eventAttendances: any[] = []

    if (userIds.length > 0) {
      // Get event registrations without include first
      const allEventRegistrations = await db.eventRegistration.findMany({
        where: { userId: { in: userIds } },
      })

      // Get all events that exist
      const eventIds = [...new Set(allEventRegistrations.map((reg) => reg.eventId))]
      const existingEvents = await db.event.findMany({
        where: { id: { in: eventIds } },
        select: {
          id: true,
          title: true,
          date: true,
          clubId: true,
        },
      })

      // Create a map of events for quick lookup
      const eventMap = new Map(existingEvents.map((event) => [event.id, event]))

      // Filter registrations to only include those with existing events
      eventRegistrations = allEventRegistrations
        .filter((reg) => eventMap.has(reg.eventId))
        .map((reg) => ({
          ...reg,
          event: eventMap.get(reg.eventId)!,
        }))

      // Get event attendances without include first
      const allEventAttendances = await db.eventAttendance.findMany({
        where: { userId: { in: userIds } },
      })

      // Filter attendances to only include those with existing events
      eventAttendances = allEventAttendances
        .filter((att) => eventMap.has(att.eventId))
        .map((att) => ({
          ...att,
          event: eventMap.get(att.eventId)!,
        }))
    }

    // Format export data
    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      clubs: ownerMemberships.map((m) => ({
        id: m.club!.id,
        name: m.club!.name,
      })),
      members: validMembers.map((member) => {
        const memberUser = member.user!
        const memberClub = member.club!

        const userRegistrations = eventRegistrations.filter(
          (reg) => reg.userId === memberUser.id && reg.event.clubId === memberClub.id,
        )

        const userAttendances = eventAttendances.filter(
          (att) => att.userId === memberUser.id && att.event.clubId === memberClub.id && att.status === "present",
        )

        const attendanceRate =
          userRegistrations.length > 0 ? Math.round((userAttendances.length / userRegistrations.length) * 100) : 0

        return {
          id: memberUser.id,
          name: memberUser.name,
          email: memberUser.email,
          role: member.role.toString(), // Convert UserRole enum to string
          club: {
            id: memberClub.id,
            name: memberClub.name,
          },
          joinedAt: member.createdAt.toISOString(),
          statistics: {
            eventsRegistered: userRegistrations.length,
            eventsAttended: userAttendances.length,
            attendanceRate: attendanceRate,
          },
        }
      }),
      summary: {
        totalMembers: validMembers.length,
        totalClubs: ownerMemberships.length,
        totalRegistrations: eventRegistrations.length,
        totalAttendances: eventAttendances.length,
      },
    }

    return exportData
  } catch (error) {
    console.error("Error exporting members data:", error)
    throw new Error("Failed to export members data")
  }
}
