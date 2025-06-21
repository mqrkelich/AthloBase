"use server"

import {db} from "@/lib/db";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import {getClubById} from "@/app/dashboard/_actions/get-club";

export const switchRole = async (role: "owner" | "member") => {

    const session = await getCurrentUser();
    if (!session) return null;

    const user = await getUserById(session.id!);
    if (!user) return null;

    // Change the query based on the role

    await db.user.update({
        where: {id: user.id},
        data: {
            dashboardView: role
        }
    })

}

export const setSelectClub = async (clubId: string) => {

    const session = await getCurrentUser();
    if (!session) return null;

    const user = await getUserById(session.id!);
    if (!user) return null;


    // Validate the clubId
    const club = await getClubById(clubId);
    if (!club) return null;

    // Change the query based on the role

    await db.user.update({
        where: {id: user.id},
        data: {
            selectedClubId: clubId
        }
    })

}


