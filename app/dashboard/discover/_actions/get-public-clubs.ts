"use server"

import {getUserById} from "@/data/user"
import {db} from "@/lib/db"

function timeAgo(date: Date): string {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    const intervals: [number, string][] = [
        [60, "second"],
        [60, "minute"],
        [24, "hour"],
        [7, "day"],
        [4.3, "week"],
        [12, "month"],
        [Number.MAX_SAFE_INTEGER, "year"],
    ]

    let unitIndex = 0
    let interval = seconds

    while (unitIndex < intervals.length - 1 && interval >= intervals[unitIndex][0]) {
        interval /= intervals[unitIndex][0]
        unitIndex++
    }

    const rounded = Math.floor(interval)
    const label = intervals[unitIndex][1]
    return `${rounded} ${label}${rounded !== 1 ? "s" : ""} ago`
}

export const getPublicClubs = async ({
                                         page = 1,
                                         per_page = 10,
                                         sport,
                                         skill,
                                         sort = "recent",
                                         search,
                                     }: {
    page?: number
    per_page?: number
    sport?: string
    skill?: string
    sort?: "recent" | "members"
    search?: string
}) => {
    try {
        const skip = (page - 1) * per_page
        const take = per_page + 1

        const orderBy: any =
            sort === "members" ? {memberCount: "desc" as const}
                    : {createdAt: "desc" as const}

        if (sport === "all") sport = undefined;
        if (skill === "all") skill = undefined;

        const clubs = await db.club.findMany({
            where: {
                privacy: "public",
                ...(sport && {sport}),
                ...(skill && {skillLevel: skill}),
                ...(search && {
                    OR: [
                        {name: {contains: search, mode: "insensitive"}},
                        {description: {contains: search, mode: "insensitive"}},
                        {location: {contains: search, mode: "insensitive"}}
                    ]
                })
            },
            orderBy,
            skip,
            take,
        })

        const hasMore = clubs.length > per_page
        const slicedClubs = clubs.slice(0, per_page)

        const publicClubs = await Promise.all(
            slicedClubs.map(async (club) => {
                const owner = await getUserById(club.clubOwnerId)

                return {
                    id: club.id,
                    name: club.name,
                    sport: club.sport,
                    description: club.description ?? "No description available",
                    location: club.location ?? "Unknown location",
                    members: club.memberCount ?? 0,
                    meetingDays: club.meetingDays ?? [],
                    skillLevel: club.skillLevel ?? "Mixed",
                    ageGroup: club.ageGroup ?? "All Ages",
                    logo: club.logo,
                    owner: owner?.name ?? "Unknown",
                    ownerImage: owner?.image,
                    created: timeAgo(club.createdAt),
                }
            })
        )

        const clubsCount = await db.club.count({
            where: {
                privacy: "public",
                ...(sport && {sport}),
                ...(skill && {skillLevel: skill}),
            },
        })

        return {
            clubs: publicClubs,
            total: clubsCount,
            hasMore,
            nextPage: hasMore ? page + 1 : null,
        }
    } catch (error) {
        console.error("[getPublicClubs error]", error)
        return {
            clubs: [],
            hasMore: false,
            nextPage: null,
        }
    }
}
