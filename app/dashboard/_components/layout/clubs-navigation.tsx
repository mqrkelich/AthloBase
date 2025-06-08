import Link from "next/link"
import {Plus} from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Badge} from "@/components/ui/badge"
import {getUserInitials} from "@/lib/helper/get-initials";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface Club {
    id: string
    name: string
    href: string
    logo: string | undefined
    role: "owner" | "member"
}

interface ClubsNavigationProps {
    currentRole: "owner" | "member"
    clubs: Club[]
}

export function ClubsNavigation({currentRole, clubs}: ClubsNavigationProps) {
    const filteredClubs = clubs.filter((club) => club.role === currentRole)

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{currentRole === "owner" ? "Your Clubs" : "Joined Clubs"}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {filteredClubs.map((club) => (
                        <SidebarMenuItem key={club.id}>
                            <SidebarMenuButton asChild>
                                <Link href={club.href}>

                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={club.logo} alt={club.name}/>
                                        <AvatarFallback>{getUserInitials(club.name)}</AvatarFallback>
                                    </Avatar>
                                    <span className="truncate max-w-[120px] overflow-hidden whitespace-nowrap">
                                        {club.name}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={`ml-auto text-xs border-0 ${
                                            club.role === "owner" ? "bg-emerald-500/20 text-emerald-500" : "bg-white/10 text-white/60"
                                        }`}
                                    >
                                        {club.role === "owner" ? "Owner" : "Member"}
                                    </Badge>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={currentRole === "owner" ? "/dashboard/club/new" : "/dashboard/discover"}>
                                <Plus className="h-4 w-4"/>
                                <span>{currentRole === "owner" ? "Create New Club" : "Join More Clubs"}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
