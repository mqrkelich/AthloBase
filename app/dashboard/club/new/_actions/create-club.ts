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
    website: z.string().optional(),
    privacy: z.enum(["public", "private", "restricted"]),
    meetingDays: z.array(z.string()),
    meetingTime: z.string(),
    skillLevel: z.string(),
    ageGroup: z.string(),
    maxMembers: z.number().min(1),
    logo: z.string().optional(),
    coverImage: z.string().optional(),
    rules: z.string().optional(),
    socialMedia: z.object({
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
    }),
    pricing: z.object({
        interval: z.enum(["weekly", "monthly", "yearly"]),
        name: z.string().min(1),
        price: z.number().min(0),
    }),
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
            error: validatedFields.error.errors?.[0]?.message || "Invalid fields",
        };
    }


    // Destructure validated fields for easier access
    const {
        name,
        sport,
        description,
        location,
        website,
        privacy,
        meetingDays,
        meetingTime,
        skillLevel,
        ageGroup,
        maxMembers,
        logo,
        coverImage,
        rules,
        socialMedia,
        pricing,
    } = validatedFields.data;

    // Ensure coverImage is set to a default if not provided

    try {
        const inviteCode = await generateUniqueInviteCode();

        const club = await db.club.create({
            data: {
                name,
                sport,
                description,
                location,
                website,
                privacy,
                meetingDays,
                meetingTime,
                skillLevel,
                ageGroup,
                maxMembers,
                logo,
                image: coverImage,
                rules,
                facebook: socialMedia.facebook,
                instagram: socialMedia.instagram,
                twitter: socialMedia.twitter,
                inviteCode,
                memberCount: 1,
                clubOwnerId: dbUser.id,
            },
        });

        if (!club) {
            return {error: "Failed to create club."};
        }

        // Create the club owner as a member with COACH role

        await db.clubMembers.create({
            data: {
                userId: dbUser.id,
                clubId: club.id,
                role: "ADMIN",
            },
        });

        // Create the club pricing

        await db.clubPricing.create({
            data: {
                clubId: club.id,
                interval: pricing.interval,
                name: pricing.name,
                price: pricing.price,
            },
        });

        // Update the user onboarding status and dashboard view

        await db.user.update({
            where: {id: dbUser.id},
            data: {
                onboarding: false,
                dashboardView: "owner",
            },
        });

        // Return the created club data

        return {success: true, club};
    } catch (err) {
        console.error("Club creation failed:", err);
        return {error: "Failed to create club."};
    }
};
