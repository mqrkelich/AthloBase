import {getCurrentUser} from "@/lib/helper/session"
import {getUserById} from "@/data/user"
import {getClubById} from "@/app/dashboard/_actions/get-club"
import {notFound} from "next/navigation"
import {getEventsByClub} from "@/app/dashboard/clubs/_actions/events"
import ClubMemberClient from "./client"

export default async function ClubMemberPage({params}: { params: Promise<{ clubId: string }> }) {
    const resolvedParams = await params

    const session = await getCurrentUser()
    const user = await getUserById(session?.id!)

    if (!user) return notFound()

    if (!resolvedParams || !resolvedParams.clubId) {
        return <div className="p-6">Invalid club ID</div>
    }

    const club = await getClubById(resolvedParams.clubId)

    if (!club) return <div className="p-6">Club not found</div>

    // Check if user is a member of this club
    const isMember = club.members.some((member) => member?.id === user.id)

    if (!isMember) {
        return <div className="p-6">You are not a member of this club</div>
    }

    const events = await getEventsByClub(resolvedParams.clubId)

    return <ClubMemberClient club={club} clubId={resolvedParams.clubId} currentUser={user} events={events || []}/>
}
