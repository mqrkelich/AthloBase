"use server";

import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import {db} from "@/lib/db";

export const joinClubWithInvite = async (inviteCode: string) => {

    const session = await getCurrentUser();
    if (!session) return {error: "Unauthorized!"};

    const user = await getUserById(session.id!);
    if (!user) return {error: "User not found."};

    const club = await db.club.findUnique({
        where: {
            inviteCode: inviteCode,
        }
    });

    if (!club) return {error: "Club not found."}

    // Check if the user is already a member of the club
    const isMember = await db.clubMembers.findFirst({
        where: {
            clubId: club.id,
            userId: user.id,
        }
    });

    if (isMember) return {error: "You are already a member of this club."}
    // Check if the user is the owner of the club
    const isOwner = club.clubOwnerId === user.id;

    if (isOwner) return {error: "You are already the owner of this club."}

    // Add the user to the club members
    await db.clubMembers.create({
        data: {
            clubId: club.id,
            userId: user.id,
            status: "active",
        }
    });

    // Increment the member count of the club
    await db.club.update({
        where: {
            id: club.id,
        },
        data: {
            memberCount: (club.memberCount || 0) + 1,
        }
    });

    // Just to make sure, we will set user onboarding to false
    await db.user.update({
        where: {id: user.id},
        data: {
            onboarding: false,
            dashboardView: "member",
        },
    });

    return {success: "Successfully joined the club."}


}

export const leaveClub = async (clubId: string) => {
    const session = await getCurrentUser();
    if (!session) return {error: "Unauthorized!"};

    const user = await getUserById(session.id!);
    if (!user) return {error: "User not found."};

    const club = await db.club.findUnique({
        where: {
            id: clubId,
        }
    });

    if (!club) return {error: "Club not found."}

    // Check if the user is a member of the club
    const isMember = await db.clubMembers.findFirst({
        where: {
            clubId: club.id,
            userId: user.id,
        }
    });

    // check if the user is the owner of the club
    const isOwner = club.clubOwnerId === user.id;
    if (isOwner) return {error: "You cannot leave a club you own. You can only remove it."}

    if (!isMember) return {error: "You are not a member of this club."}

    // Remove the user from the club members
    await db.clubMembers.delete({
        where: {
            id: isMember.id,
        }
    });

    // Decrement the member count of the club
    await db.club.update({
        where: {
            id: club.id,
        },
        data: {
            memberCount: (club.memberCount || 0) - 1,
        }
    });

    return {success: "Successfully left the club."}
}