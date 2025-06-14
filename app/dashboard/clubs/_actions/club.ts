"use server"

import {db} from "@/lib/db";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";

export async function updateClubAction(clubId: string, formData: any) {
    // Basic validation
    if (!formData.name || !formData.sport || !formData.location) return {error: "Name, sport, and location are required fields."};

    const session = await getCurrentUser();
    if (!session) return {error: "Unauthorized!"};

    const dbUser = await getUserById(session.id!);
    if (!dbUser) return {error: "User not found."};

    const club = await db.club.findUnique({
        where: {id: clubId},
    })

    if (!club) return {error: "Club not found"}
    if (club.clubOwnerId !== dbUser.id) return {error: "You are not authorized to create events for this club"};


    // Update Club base info
    const updatedClub = await db.club.update({
        where: {id: clubId},
        data: {
            name: formData.name,
            sport: formData.sport,
            description: formData.description,
            image: formData.coverImage,
            logo: formData.logo,
            location: formData.location,
            website: formData.website,
            foundedDate: formData.foundedDate,
            updatedAt: new Date(),
        },
    });

    await db.clubPricing.deleteMany({where: {clubId}});

    for (const interval of ["weekly", "monthly", "yearly"]) {
        const tierData = formData.pricing[interval];
        if (!tierData) continue;

        await db.clubPricing.create({
            data: {
                clubId,
                interval,
                name: tierData.name,
                price: tierData.price,
                features: {
                    create: tierData.features.map((feature: string) => ({
                        description: feature,
                    })),
                },
            },
        });
    }

    return {success: "Club updated successfully", club: updatedClub}
}
