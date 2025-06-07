"use server"

import {db} from "@/lib/db";

export const getUserClubs = async (id: string, role: "owner" | "member") => {
    try {
        const user = await db.user.findUnique({
            where: {id}
        });

        if (!user) return null;

        if (role === "owner") {
            return await db.club.findMany({
                where: {
                    clubOwnerId: user.id
                }
            });
        }

        if (role === "member") {
            return await db.club.findMany({
                where: {
                    clubMembers: {
                        some: {
                            userId: user.id
                        }
                    }
                }
            });
        }

        return null;
    } catch {
        return null;
    }
}

