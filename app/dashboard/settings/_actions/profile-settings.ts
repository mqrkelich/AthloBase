"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getUserProfile(userId: string) {
  try {
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

    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw new Error("Failed to fetch user profile")
  }
}

export async function updateUserProfile(userId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    console.log("Updating profile for user:", userId)
    console.log("Name:", name)
    console.log("Email:", email)

    const updateData: any = {}

    if (name && name.trim()) updateData.name = name.trim()
    if (email && email.trim()) updateData.email = email.trim()

    console.log("Update data:", updateData)

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    })

    console.log("Updated user:", updatedUser)

    revalidatePath("/dashboard/settings/profile")
    revalidatePath(`/profile/${userId}`)

    return updatedUser
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw new Error("Failed to update user profile")
  }
}

export async function updateUserAvatar(userId: string, imageUrl: string) {
  try {
    console.log("Updating avatar for user:", userId, "with URL:", imageUrl)

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        image: imageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    })

    console.log("Avatar updated:", updatedUser)

    revalidatePath("/dashboard/settings/profile")
    revalidatePath(`/profile/${userId}`)

    return updatedUser
  } catch (error) {
    console.error("Error updating user avatar:", error)
    throw new Error("Failed to update user avatar")
  }
}

export async function exportUserData(userId: string) {
  try {
    console.log("Exporting data for user:", userId)

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

    if (!user) {
      throw new Error("User not found")
    }

    console.log("User found:", user)

    // Get club memberships without include to avoid null issues
    const allClubMemberships = await db.clubMembers.findMany({
      where: { userId },
      select: {
        id: true,
        role: true,
        createdAt: true,
        clubId: true,
      },
    })

    console.log("Raw club memberships found:", allClubMemberships.length)

    // Get club details separately
    const clubIds = allClubMemberships.map((m) => m.clubId)
    const clubs =
      clubIds.length > 0
        ? await db.club.findMany({
            where: { id: { in: clubIds } },
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
            },
          })
        : []

    // Combine club memberships with club details
    const validClubMemberships = allClubMemberships
      .map((membership) => {
        const club = clubs.find((c) => c.id === membership.clubId)
        return club ? { ...membership, club } : null
      })
      .filter(Boolean)

    console.log("Valid club memberships found:", validClubMemberships.length)

    // Get event registrations without include to avoid null issues
    const allEventRegistrations = await db.eventRegistration.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        eventId: true,
      },
    })

    console.log("Raw event registrations found:", allEventRegistrations.length)

    // Get event details separately
    const registrationEventIds = allEventRegistrations.map((r) => r.eventId)
    const registrationEvents =
      registrationEventIds.length > 0
        ? await db.event.findMany({
            where: { id: { in: registrationEventIds } },
            select: {
              id: true,
              title: true,
              date: true,
              time: true,
              location: true,
              type: true,
            },
          })
        : []

    // Combine registrations with event details
    const validEventRegistrations = allEventRegistrations
      .map((registration) => {
        const event = registrationEvents.find((e) => e.id === registration.eventId)
        return event ? { ...registration, event } : null
      })
      .filter(Boolean)

    console.log("Valid event registrations found:", validEventRegistrations.length)

    // Get event attendances without include to avoid null issues
    const allEventAttendances = await db.eventAttendance.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        checkedInAt: true,
        notes: true,
        eventId: true,
      },
    })

    console.log("Raw event attendances found:", allEventAttendances.length)

    // Get event details for attendances separately
    const attendanceEventIds = allEventAttendances.map((a) => a.eventId)
    const attendanceEvents =
      attendanceEventIds.length > 0
        ? await db.event.findMany({
            where: { id: { in: attendanceEventIds } },
            select: {
              id: true,
              title: true,
              date: true,
              time: true,
              location: true,
              type: true,
            },
          })
        : []

    // Combine attendances with event details
    const validEventAttendances = allEventAttendances
      .map((attendance) => {
        const event = attendanceEvents.find((e) => e.id === attendance.eventId)
        return event ? { ...attendance, event } : null
      })
      .filter(Boolean)

    console.log("Valid event attendances found:", validEventAttendances.length)

    // Compile all data
    const exportData = {
      user,
      clubMemberships: validClubMemberships.map((membership: any) => ({
        id: membership.id,
        role: membership.role,
        joinedAt: membership.createdAt,
        club: membership.club,
      })),
      eventRegistrations: validEventRegistrations.map((registration: any) => ({
        id: registration.id,
        registeredAt: registration.createdAt,
        event: registration.event,
      })),
      eventAttendances: validEventAttendances.map((attendance: any) => ({
        id: attendance.id,
        status: attendance.status,
        checkedInAt: attendance.checkedInAt,
        notes: attendance.notes,
        event: attendance.event,
      })),
      exportedAt: new Date().toISOString(),
    }

    console.log("Export data compiled successfully")

    return exportData
  } catch (error) {
    console.error("Error exporting user data:", error)
    throw new Error("Failed to export user data")
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    console.log("Deleting account for user:", userId)

    // Delete in order to respect foreign key constraints
    await db.eventAttendance.deleteMany({
      where: { userId },
    })

    await db.eventRegistration.deleteMany({
      where: { userId },
    })

    await db.clubMembers.deleteMany({
      where: { userId },
    })

    // Finally delete the user
    await db.user.delete({
      where: { id: userId },
    })

    console.log("Account deleted successfully")

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user account:", error)
    throw new Error("Failed to delete user account")
  }
}
