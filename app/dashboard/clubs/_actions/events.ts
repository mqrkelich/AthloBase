"use server"

import {z} from "zod"
import {db} from "@/lib/db";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";

const eventSchema = z.object({
    clubId: z.string(),
    title: z.string(),
    type: z.string(),
    date: z.string(),
    time: z.string(),
    duration: z.number(),
    location: z.string(),
    maxAttendees: z.number(),
    description: z.string().optional(),
    recurring: z.string(),
    coach: z.string().optional(),
})

export async function createEvent(data: z.infer<typeof eventSchema>) {
    const parsed = eventSchema.safeParse(data)
    if (!parsed.success) {
        return {error: parsed.error.errors[0].message || "Invalid event data"}
    }

    const session = await getCurrentUser();
    if (!session) return {error: "Unauthorized!"};

    const dbUser = await getUserById(session.id!);
    if (!dbUser) return {error: "User not found."};

    const club = await db.club.findUnique({
        where: {id: parsed.data.clubId},
    })

    if (!club) return {error: "Club not found"}
    if (club.clubOwnerId !== dbUser.id) return {error: "You are not authorized to create events for this club"};

    const {
        clubId,
        title,
        type,
        date,
        time,
        duration,
        location,
        maxAttendees,
        description,
        recurring,
        coach,
    } = parsed.data

    await db.event.create({
        data: {
            clubId,
            title,
            type,
            date: new Date(date),
            time,
            duration,
            location,
            maxAttendees,
            description,
            recurring,
            coach,
            status: "scheduled",
        },
    })

    await db.club.update({
        where: {id: clubId},
        data: {
            totalEvents: {
                increment: 1,
            },
            activeEvents: {
                increment: 1,
            },
        },
    });

    return {success: "Event create successfully."}

}

export async function deleteEvent(clubId: string, eventId: string) {

    const session = await getCurrentUser();
    if (!session) {
        return {error: "Unauthorized!"};
    }

    const dbUser = await getUserById(session.id!);
    if (!dbUser) {
        return {error: "User not found."};
    }

    const club = await db.club.findUnique({
        where: {id: clubId},
    })
    if (!club) {
        return {error: "Club not found"}
    }

    if (club.clubOwnerId !== dbUser.id) {
        return {error: "You are not authorized to create events for this club"};
    }

    const event = await db.event.findUnique({
        where: {id: eventId},
    })

    if (!event) {
        return {error: "Event not found"}
    }

    // Delete the event
    await db.event.delete({
        where: {id: eventId},
    });

    // Update the club's active events count
    await db.club.update({
        where: {id: clubId},
        data: {
            activeEvents: {
                decrement: 1,
            },
        },
    });

    return {success: "Event deleted successfully."}

}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export async function getEventsByClub(clubId: string) {

    const session = await getCurrentUser();
    if (!session) return [];

    const dbUser = await getUserById(session.id!);
    if (!dbUser) return [];

    // Fetch events for the club, ordered by date
    const club = await db.club.findUnique({
        where: {id: clubId},
    })

    if (!club) return [];

    if (club.clubOwnerId !== dbUser.id) return [];

    const events = await db.event.findMany({
        where: {clubId},
        orderBy: {date: "asc"},
    })

    if (!events || events.length === 0) return [];


    return events.map((event) => ({
        id: event.id,
        title: event.title,
        type: capitalize(event.type),
        date: event.date.toISOString().split("T")[0],
        time: event.time,
        duration: event.duration,
        location: event.location,
        attendees: event.attendees,
        maxAttendees: event.maxAttendees,
        status: capitalize(event.status),
        recurring: capitalize(event.recurring),
        description: event.description ?? "",
        coach: event.coach ?? "",
    }))

}

