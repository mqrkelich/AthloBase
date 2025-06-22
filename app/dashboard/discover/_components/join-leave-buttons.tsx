"use client"


import {joinClubWithInvite, leaveClub} from "@/app/dashboard/_actions/join-club";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

interface JoinLeaveButtonsProps {
    isMember: boolean;
    inviteCode: string;
    clubId: string;
}

export default function JoinLeaveButtons({isMember, inviteCode, clubId}: JoinLeaveButtonsProps) {

    const router = useRouter();

    const handleJoinClub = async () => {
        await joinClubWithInvite(inviteCode).then((message) => {
            if (message.error) {
                toast.error(message.error)
                return;
            }

            router.refresh();
            toast.success(message.success || "Successfully joined the club.")
        })
    }

    const handleLeaveClub = async () => {
        await leaveClub(clubId).then((message) => {
            if (message.error) {
                toast.error(message.error)
                return;
            }

            router.refresh();
            toast.success(message.success || "Successfully left the club.")
        })
    }

    return (
        <div>
            {isMember ? (
                <Button onClick={handleLeaveClub} variant="destructive" className="w-full mt-2">
                    Leave Club
                </Button>
            ) : (
                <Button onClick={handleJoinClub} variant="default" className="w-full mt-2">
                    Join Club
                </Button>
            )}
        </div>
    )
}
