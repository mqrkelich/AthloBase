"use server";

import {z} from "zod";

import {getCurrentUser} from "@/lib/helper/session";
import {db} from "@/lib/db";
import {getUserById} from "@/data/user";
import {generateUniqueInviteCode} from "@/app/onboarding/_actions/create-club";

const createClubSchema = z.object({
    name: z.string().min(3).max(50),
    sport: z.string(),
    description: z.string().min(10).max(500),
    location: z.string(),
    privacy: z.enum(["public", "private", "restricted"]),
    meetingDays: z.array(z.string()),
    meetingTime: z.string(),
    skillLevel: z.string(),
    ageGroup: z.string(),
});


export const createClubDashboard = async (
    values: z.infer<typeof createClubSchema>
) => {
    const session = await getCurrentUser();
    if (!session) {
        return {error: "Unauthorized!"};
    }

    const dbUser = await getUserById(session.id!);
    if (!dbUser) {
        return {error: "User not found."};
    }

    const validatedFields = createClubSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error:
                validatedFields.error.errors?.[0]?.message || "Invalid fields",
        };
    }

    const {
        name,
        sport,
        description,
        location,
        privacy,
        meetingDays,
        meetingTime,
        skillLevel,
        ageGroup,
    } = validatedFields.data;

    try {

        const inviteCode = await generateUniqueInviteCode();

        const club = await db.club.create({
            data: {
                name,
                sport,
                description,
                location,
                privacy,
                meetingDays,
                meetingTime,
                skillLevel,
                ageGroup,
                inviteCode,
                memberCount: 1,
                clubOwnerId: dbUser.id,
            },
        });

        await db.clubMembers.create({
            data: {
                userId: dbUser.id,
                clubId: club.id,
                role: "ADMIN",
            },
        });

        await db.user.update({
            where: {id: dbUser.id},
            data: {
                onboarding: false,
                dashboardView: "owner",
            },
        })

        return {success: true, club};
    } catch (err) {
        console.error("Club creation failed:", err);
        return {error: "Failed to create club."};
    }
};
