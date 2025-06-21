"use client"

import {useState} from "react"

import {InviteLinkDialog} from "@/app/dashboard/_components/club-managment/invite-link-dialog";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";


export default function InviteLink() {

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

    return (
        <div>

            <Button onClick={() => setInviteDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4"/>
                Invite Members
            </Button>


            <InviteLinkDialog
                open={inviteDialogOpen}
                onOpenChange={setInviteDialogOpen}
                clubName="City Runners"
                clubId="city-runners"
                inviteCode="owner-id-123"
            />
        </div>
    )
}
