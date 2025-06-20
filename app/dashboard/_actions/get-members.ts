"use server"

import {db} from "@/lib/db"
import {getCurrentUser} from "@/lib/helper/session"
import {getUserById} from "@/data/user"

export const getPaginatedMembers = async (clubId: string, page: number, pageSize: number) => {
    const session = await getCurrentUser()
    if (!session) return {members: [], total: 0}

    const user = await getUserById(session.id!)
    if (!user) return {members: [], total: 0}

    const club = await db.club.findUnique({
        where: {
            id: clubId,
            clubOwnerId: user.id,
        },
        include: {
            clubMembers: {
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {createdAt: "desc"},
            },
        },
    })

    if (!club) return {members: [], total: 0}

    const members = await Promise.all(club.clubMembers.map(async (member) => {

        const user = await getUserById(member.userId)

        return {
            id: member.userId,
            name: user ? user.name || "Anonymous" : "Anonymous",
            email: user ? user.email || "No email" : "No email",
            role: member.role,
            status: member.status || "active",
            joinDate: member.createdAt.toISOString(),
            attendance: 0, // TODO: Implement real attendance logic
            totalEvents: 0, // TODO: Implement real event tracking
            avatar: user ? user.image : null,
        }
    }));

    const total = await db.clubMembers.count({
        where: {clubId},
    })

    return {members, total}
}
