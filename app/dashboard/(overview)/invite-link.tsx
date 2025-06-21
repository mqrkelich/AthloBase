"use client"

import {useState} from "react"

import {InviteLinkDialog} from "@/app/dashboard/_components/club-managment/invite-link-dialog";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

interface InviteLinkProps {
    club: {
        name: string
        id: string
        inviteCode: string | null
    }
    webUrl: string
}


export default function InviteLink({webUrl, club}: InviteLinkProps) {

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

    return (
        <div>

            <Button onClick={() => setInviteDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4"/>
                Invite Members
            </Button>


            <InviteLinkDialog
                open={inviteDialogOpen}
                onOpenChangeAction={setInviteDialogOpen}
                clubName={club.name}
                clubId={club.id}
                inviteCode={club.inviteCode || ""}
                webUrl={webUrl}
            />
        </div>
    )
}
