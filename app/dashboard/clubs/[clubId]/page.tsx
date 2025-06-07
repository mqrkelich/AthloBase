import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import {getClub} from "@/app/dashboard/_actions/get-club";
import {notFound} from "next/navigation";
import ClubManagementClient from "./client";

export default async function ClubManagementPage({params}: { params: Promise<{ clubId: string }> }) {
    const resolvedParams = await params; // await the params object

    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!user) return notFound();

    if (!resolvedParams || !resolvedParams.clubId) {
        return <div className="p-6">Invalid club ID</div>;
    }

    const club = await getClub(resolvedParams.clubId, user.id);

    if (!club) return <div className="p-6">Club not found</div>;

    return <ClubManagementClient club={club} clubId={resolvedParams.clubId}/>;
}
