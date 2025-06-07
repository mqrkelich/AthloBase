"use client"

import {ChevronDown, Layers, Plus} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"

interface Club {
    id: string
    name: string
    role: "owner" | "member"
}

interface ClubSelectorProps {
    currentRole: "owner" | "member"
    selectedClub: Club
    clubs: Club[]
}

export function ClubSelector({currentRole, selectedClub, clubs}: ClubSelectorProps) {
    const filteredClubs = clubs.filter((club) => club.role === currentRole)

    const createNew = () => {
        if (currentRole === "owner") {
            window.location.href = "/dashboard/club/new"
        } else {
            window.location.href = "/dashboard/discover"
        }
    }

    const selectClub = (club: Club) => {
        if (currentRole === "owner") {
            window.location.href = `/dashboard/clubs/${club.id}`
        } else {
            window.location.href = `/clubs/${club.id}`
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                    <Layers className="h-4 w-4"/>
                    <span>{selectedClub.name}</span>
                    <ChevronDown className="h-4 w-4 opacity-50"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {filteredClubs.map((club) => (
                    <DropdownMenuItem key={club.id} onClick={() => selectClub(club)}>
                        <div
                            className={`h-4 w-4 rounded-full ${currentRole == "owner" ? "text-emerald-500" : "text-blue-500"} mr-2`}></div>
                        <span>{club.name}</span>
                        <Badge
                            variant="outline"
                            className={`ml-auto text-xs border-0 ${
                                club.role === "owner" ? "bg-emerald-500/20 text-emerald-500" : "bg-white/10 text-white/60"
                            }`}
                        >
                            {club.role === "owner" ? "Owner" : "Member"}
                        </Badge>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={createNew}>
                    <Plus className="mr-2 h-4 w-4"/>
                    <span>{currentRole === "owner" ? "Create New Club" : "Join More Clubs"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
