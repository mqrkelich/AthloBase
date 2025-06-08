"use server"

import {db} from "@/lib/db";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";

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

