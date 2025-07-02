"use server"

import { db } from "@/lib/db"

export interface UserProfileData {
  user: {
    id: string
    name: string
    email: string
    image: string | null
    createdAt: Date
  }
  stats: {
    totalClubs: number
    totalEvents: number
    attendanceRate: number
    currentStreak: number
    longestStreak: number
    totalAttendance: number
    memberSince: Date
  }
  clubs: Array<{
    id: string
    name: string
    logo: string | null
    role: string
    joinedAt: Date
    attendanceRate: number
    eventsAttended: number
    totalEvents: number
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    color: string
    unlockedAt: Date
  }>
  recentActivity: Array<{
    id: string
    type: "club_joined" | "event_attended" | "event_missed" | "achievement_unlocked"
    title: string
    description: string
    timestamp: Date
    clubName?: string
    icon: string
    color: string
  }>
}

type ActivityType = "club_joined" | "event_attended" | "event_missed" | "achievement_unlocked"

interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  clubName?: string
  icon: string
  color: string
}

export async function getUserProfile(userId: string, currentUserId: string): Promise<UserProfileData | null> {
  try {
    console.log("Fetching profile for userId:", userId)

    // Get user basic info
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    })

    if (!user || !user.name || !user.email) {
      console.log("User not found or missing required fields:", user)
      return null
    }

    console.log("User found:", user)

    // Get user's club memberships (filter out null clubs)
    const allClubMemberships = await db.clubMembers.findMany({
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
    const clubMemberships = allClubMemberships.filter((membership) => membership.club !== null)
    console.log("Club memberships found:", clubMemberships.length)

    const clubIds = clubMemberships.map((m) => m.clubId)

    // Get all events from user's clubs
    let allEvents: any[] = []
    if (clubIds.length > 0) {
      allEvents = await db.event.findMany({
        where: {
          clubId: { in: clubIds },
        },
        select: {
          id: true,
          title: true,
          date: true,
          time: true,
          duration: true,
          clubId: true,
        },
        orderBy: { date: "desc" },
      })
    }

    const eventIds = allEvents.map((e) => e.id)

    // Get user's event registrations and attendances
    let registrations: any[] = []
    let attendances: any[] = []

    if (eventIds.length > 0) {
      registrations = await db.eventRegistration.findMany({
        where: {
          userId: user.id,
          eventId: { in: eventIds },
        },
      })

      attendances = await db.eventAttendance.findMany({
        where: {
          userId: user.id,
          eventId: { in: eventIds },
        },
      })
    }

    // Calculate statistics
    const totalClubs = clubMemberships.length
    const totalEvents = registrations.length
    const totalAttendance = attendances.filter((a) => a.status === "present").length
    const attendanceRate = totalEvents > 0 ? Math.round((totalAttendance / totalEvents) * 100) : 0

    // Calculate current streak
    let currentStreak = 0
    const recentEvents = allEvents
      .filter((event) => registrations.some((r) => r.eventId === event.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    for (const event of recentEvents) {
      const attendance = attendances.find((a) => a.eventId === event.id)
      if (attendance && attendance.status === "present") {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    const chronologicalEvents = [...recentEvents].reverse()

    for (const event of chronologicalEvents) {
      const attendance = attendances.find((a) => a.eventId === event.id)
      if (attendance && attendance.status === "present") {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    // Generate achievements
    const achievements = generateAchievements(
      totalClubs,
      totalAttendance,
      attendanceRate,
      currentStreak,
      longestStreak,
      user.createdAt,
    )

    // Generate club data with individual stats
    const clubs = clubMemberships.map((membership) => {
      const clubEvents = allEvents.filter((e) => e.clubId === membership.clubId)
      const clubRegistrations = registrations.filter((r) => clubEvents.some((e) => e.id === r.eventId))
      const clubAttendances = attendances.filter(
        (a) => clubEvents.some((e) => e.id === a.eventId) && a.status === "present",
      )

      const clubAttendanceRate =
        clubRegistrations.length > 0 ? Math.round((clubAttendances.length / clubRegistrations.length) * 100) : 0

      return {
        id: membership.club!.id,
        name: membership.club!.name,
        logo: membership.club!.logo,
        role: membership.role,
        joinedAt: membership.createdAt,
        attendanceRate: clubAttendanceRate,
        eventsAttended: clubAttendances.length,
        totalEvents: clubRegistrations.length,
      }
    })

    // Generate recent activity
    const activities: Activity[] = []

    // Add club join activities
    clubMemberships.forEach((membership) => {
      activities.push({
        id: `club_${membership.id}`,
        type: "club_joined",
        title: "Joined Club",
        description: `Joined ${membership.club!.name}`,
        timestamp: membership.createdAt,
        clubName: membership.club!.name,
        icon: "Users",
        color: "text-blue-400",
      })
    })

    // Add recent event activities
    const recentAttendances = attendances
      .filter((a) => allEvents.some((e) => e.id === a.eventId))
      .sort((a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime())
      .slice(0, 10)

    recentAttendances.forEach((attendance) => {
      const event = allEvents.find((e) => e.id === attendance.eventId)
      const club = clubMemberships.find((m) => m.clubId === event?.clubId)

      if (event && club) {
        activities.push({
          id: `attendance_${attendance.id}`,
          type: attendance.status === "present" ? "event_attended" : "event_missed",
          title: attendance.status === "present" ? "Attended Event" : "Missed Event",
          description: `${event.title}`,
          timestamp: attendance.checkedInAt,
          clubName: club.club!.name,
          icon: attendance.status === "present" ? "CheckCircle" : "XCircle",
          color: attendance.status === "present" ? "text-green-400" : "text-red-400",
        })
      }
    })

    // Add achievement activities
    achievements.forEach((achievement) => {
      activities.push({
        id: `achievement_${achievement.id}`,
        type: "achievement_unlocked",
        title: "Achievement Unlocked",
        description: achievement.title,
        timestamp: achievement.unlockedAt,
        icon: "Award",
        color: "text-yellow-400",
      })
    })

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const stats = {
      totalClubs,
      totalEvents,
      attendanceRate,
      currentStreak,
      longestStreak,
      totalAttendance,
      memberSince: user.createdAt,
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      },
      stats,
      clubs,
      achievements,
      recentActivity: activities.slice(0, 20),
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

function generateAchievements(
  totalClubs: number,
  totalAttendance: number,
  attendanceRate: number,
  currentStreak: number,
  longestStreak: number,
  memberSince: Date,
) {
  const achievements = []
  const now = new Date()

  // First Steps
  if (totalClubs >= 1) {
    achievements.push({
      id: "first_club",
      title: "First Steps",
      description: "Joined your first club",
      icon: "🎯",
      color: "bg-blue-500/20 text-blue-400",
      unlockedAt: memberSince,
    })
  }

  // Regular Attendee
  if (totalAttendance >= 5) {
    achievements.push({
      id: "regular_attendee",
      title: "Regular Attendee",
      description: "Attended 5 events",
      icon: "📅",
      color: "bg-green-500/20 text-green-400",
      unlockedAt: new Date(memberSince.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week after joining
    })
  }

  // Dedicated Member
  if (totalAttendance >= 20) {
    achievements.push({
      id: "dedicated_member",
      title: "Dedicated Member",
      description: "Attended 20 events",
      icon: "⭐",
      color: "bg-purple-500/20 text-purple-400",
      unlockedAt: new Date(memberSince.getTime() + 30 * 24 * 60 * 60 * 1000), // 1 month after joining
    })
  }

  // Perfect Attendance
  if (attendanceRate >= 90 && totalAttendance >= 10) {
    achievements.push({
      id: "perfect_attendance",
      title: "Perfect Attendance",
      description: "90%+ attendance rate",
      icon: "🏆",
      color: "bg-yellow-500/20 text-yellow-400",
      unlockedAt: new Date(memberSince.getTime() + 14 * 24 * 60 * 60 * 1000), // 2 weeks after joining
    })
  }

  // Streak Master
  if (longestStreak >= 5) {
    achievements.push({
      id: "streak_master",
      title: "Streak Master",
      description: `${longestStreak} event streak`,
      icon: "🔥",
      color: "bg-orange-500/20 text-orange-400",
      unlockedAt: new Date(memberSince.getTime() + 21 * 24 * 60 * 60 * 1000), // 3 weeks after joining
    })
  }

  // Club Hopper
  if (totalClubs >= 3) {
    achievements.push({
      id: "club_hopper",
      title: "Club Hopper",
      description: "Member of 3+ clubs",
      icon: "🌟",
      color: "bg-indigo-500/20 text-indigo-400",
      unlockedAt: new Date(memberSince.getTime() + 60 * 24 * 60 * 60 * 1000), // 2 months after joining
    })
  }

  return achievements
}
