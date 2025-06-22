"use server"

import {db} from "@/lib/db";
import {Activity, Target, Users, Trophy} from "lucide-react";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";

export const getClub = async (id: string, userId: string) => {
    try {
        const user = await db.user.findUnique({
            where: {id: userId}
        });

        if (!user) return null;

        const club = await db.club.findUnique({
            where: {id: id, clubOwnerId: user.id},
            include: {
                customStats: true,
                pricing: {
                    include: {
                        features: true,
                    },
                },
            },
        });

        if (!club) return null;

        const iconMap = {
            activity: Activity,
            target: Target,
            users: Users,
            trophy: Trophy,
        }

        type IconKey = keyof typeof iconMap

        const customStats = club.customStats.map((stat, index) => {
            const iconKey = stat.icon ? stat.icon.toLowerCase() : ""

            return {
                id: stat.id,
                label: stat.label,
                value: stat.value,
                unit: stat.unit,
                icon: stat.icon || "users",
            }
        })


        interface PricingEntry {
            name: string;
            price: number;
            features: string[];
        }

        interface Pricing {
            weekly: PricingEntry;
            monthly: PricingEntry;
            yearly: PricingEntry;
        }

        const pricing: Pricing = {
            weekly: {
                name: "",
                price: 0,
                features: [],
            },
            monthly: {
                name: "",
                price: 0,
                features: [],
            },
            yearly: {
                name: "",
                price: 0,
                features: [],
            },
        };

        club.pricing.forEach((price) => {
            if (price.interval === "weekly" || price.interval === "monthly" || price.interval === "yearly") {
                pricing[price.interval] = {
                    name: price.name,
                    price: price.price,
                    features: price.features.map((f) => f.description),
                };
            }
        });

        return {
            id: club.id,
            name: club.name,
            sport: club.sport,
            description: club.description ?? "",
            coverImage: club.image ?? "/placeholder.svg?height=200&width=800",
            logo: club.logo ?? "/placeholder.svg?height=80&width=80",
            memberCount: club.memberCount ?? 0,
            activeEvents: club.activeEvents ?? 0,
            totalEvents: club.totalEvents ?? 0,
            foundedDate: club.foundedDate || null,
            location: club.location ?? "",
            website: club.website ?? "",
            inviteCode: club.inviteCode ?? null,
            customStats,
            pricing,
        };

    } catch {
        return null;
    }
}


type Interval = "weekly" | "monthly" | "yearly";

export const getClubById = async (id: string) => {
    const club = await db.club.findUnique({
        where: {id},
        include: {
            customStats: true,
            pricing: {
                include: {
                    features: true,
                },
            },
            clubMembers: true,
        },
    });

    if (!club) return null;

    const iconMap = {
        activity: Activity,
        target: Target,
        users: Users,
        trophy: Trophy,
    }

    const customStats = club.customStats.map((stat, index) => {
        const iconKey = typeof stat.icon === "string" ? stat.icon.toLowerCase() : "";

        const icon = iconMap[iconKey as keyof typeof iconMap] ?? Users;
        return {
            id: index + 1,
            label: stat.label,
            value: stat.value,
            unit: stat.unit,
            icon,
        };
    });

    const pricing: Record<Interval, { name: string; price: number; features: string[] }> = {
        weekly: {name: "", price: 0, features: []},
        monthly: {name: "", price: 0, features: []},
        yearly: {name: "", price: 0, features: []},
    };

    club.pricing.forEach((price) => {
        if (["weekly", "monthly", "yearly"].includes(price.interval)) {
            const interval = price.interval as Interval;
            pricing[interval] = {
                name: price.name,
                price: price.price,
                features: price.features.map((f) => f.description),
            };
        }
    });

    const members = await Promise.all(
        club.clubMembers.map(async (member) => {
            const user = await getUserById(member.userId);
            if (!user) return null;
            return {
                id: user.id,
                name: user.name || "Unknown User",
                email: user.email,
                image: user.image,
                joined: member.createdAt || null
            };
        })
    );

    const ownerInfo = await getUserById(club.clubOwnerId);
    const owner = ownerInfo ? {
        id: ownerInfo.id,
        name: ownerInfo.name || "Club Owner",
        email: ownerInfo.email,
        image: ownerInfo.image,
        createdAt: ownerInfo.createdAt,
    } : null;

    return {
        id: club.id,
        name: club.name,
        sport: club.sport,
        description: club.description ?? "",
        coverImage: club.image ?? "/placeholder.svg?height=200&width=800",
        logo: club.logo ?? "/placeholder.svg?height=80&width=80",
        memberCount: club.memberCount ?? 0,
        activeEvents: club.activeEvents ?? 0,
        privacy: club.privacy
            .charAt(0)
            .toUpperCase() + club.privacy.slice(1),
        meetingDays: club.meetingDays ?? [],
        meetingTime: club.meetingTime ?? "",
        skillLevel: club.skillLevel ? club.skillLevel.charAt(0).toUpperCase() + club.skillLevel.slice(1) : "Mixed",
        ageGroup: club.ageGroup ? club.ageGroup.charAt(0).toUpperCase() + club.ageGroup.slice(1) : "All Ages",
        totalEvents: club.totalEvents ?? 0,
        foundedDate: club.foundedDate || null,
        location: club.location ?? "",
        website: club.website ?? "",
        members: members.filter(Boolean),
        inviteCode: club.inviteCode ?? null,
        owner,
        customStats,
        pricing,
    };

}

export const getClubInviteCode = async (clubId: string) => {
    const session = await getCurrentUser();
    if (!session) return null;

    const user = await getUserById(session.id!);
    if (!user) return null;

    const club = await db.club.findUnique({
        where: {id: clubId, clubOwnerId: user.id},
        select: {
            inviteCode: true,
        },
    });

    if (!club) return null;

    return club.inviteCode;
}

export const getClubByInviteCode = async (inviteCode: string) => {

    const session = await getCurrentUser();
    if (!session) return null;

    const user = await getUserById(session.id!);
    if (!user) return null;

    const club = await db.club.findUnique({
        where: {inviteCode: inviteCode,},
    });

    if (!club) return null;

    return club;
}
