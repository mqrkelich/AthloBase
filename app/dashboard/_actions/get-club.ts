"use server"

import {db} from "@/lib/db";
import {Activity, Target, Users, Trophy} from "lucide-react";

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
            const icon =
                iconKey && iconKey in iconMap
                    ? iconMap[iconKey as IconKey]
                    : Users // fallback icon

            return {
                id: index + 1,
                label: stat.label,
                value: stat.value,
                unit: stat.unit,
                icon,
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
            foundedDate: club.foundedDate?.toISOString().split("T")[0] ?? null,
            location: club.location ?? "",
            website: club.website ?? "",
            customStats,
            pricing,
        };

    } catch {
        return null;
    }
}

