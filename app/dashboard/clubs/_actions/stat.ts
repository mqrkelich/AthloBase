"use server"

import {db} from "@/lib/db";
import {z} from "zod"
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";

const StatSchema = z.object({
    clubId: z.string(),
    label: z.string(),
    value: z.string(),
    unit: z.string(),
    icon: z.string().optional(),
})

export async function createClubStat(formData: z.infer<typeof StatSchema>) {
    const validated = StatSchema.safeParse(formData)
    if (!validated.success) return {error: "Invalid Club Stat"};

    const session = await getCurrentUser();
    if (!session) return {error: "Unauthorized!"};

    const dbUser = await getUserById(session.id!);
    if (!dbUser) return {error: "User not found."};


    const club = await db.club.findUnique({
        where: {id: validated.data.clubId},
    })
    if (!club) return {error: "Club not found"}
    if (club.clubOwnerId !== dbUser.id) return {error: "You are not authorized to create events for this club"};

    // Check if club has more than 4 custom stats, if so, return an error

    const existingStats = await db.clubStat.count({
        where: {clubId: validated.data.clubId},
    })
    if (existingStats >= 4) {
        return {error: "You can only have a maximum of 4 custom stats for a club."}
    }

    await db.clubStat.create({
        data: {
            clubId: validated.data.clubId,
            label: validated.data.label,
            value: validated.data.value,
            unit: validated.data.unit,
            icon: validated.data.icon ?? "Activity",
        },
    })

    return {success: "Stat created successfully."}
}

export async function updateClubStat(data: {
    id: string
    clubId: string
    label: string
    value: string
    unit: string
    icon?: string
}) {


    const session = await getCurrentUser();
    if (!session) return {error: "Unauthorized!"};

    const dbUser = await getUserById(session.id!);
    if (!dbUser) return {error: "User not found."};


    const club = await db.club.findUnique({
        where: {id: data.clubId},
    })
    if (!club) return {error: "Club not found"}
    if (club.clubOwnerId !== dbUser.id) return {error: "You are not authorized to create events for this club"};

    await db.clubStat.update({
        where: {id: data.id},
        data: {
            label: data.label,
            value: data.value,
            unit: data.unit,
            icon: data.icon,
        },
    })

    return {success: "Stat updated successfully."}
}

export async function deleteClubStat(clubId: string, statId: string) {
    const session = await getCurrentUser();
    if (!session) return {error: "Unauthorized!"};

    const dbUser = await getUserById(session.id!);
    if (!dbUser) return {error: "User not found."};

    const club = await db.club.findUnique({
        where: {id: clubId},
    })
    if (!club) return {error: "Club not found"}
    if (club.clubOwnerId !== dbUser.id) return {error: "You are not authorized to create events for this club"};

    await db.clubStat.delete({
        where: {id: statId},
    })

    return {success: "Stat deleted successfully."}
}