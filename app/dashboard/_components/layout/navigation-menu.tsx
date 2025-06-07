import Link from "next/link"
import {Home, Calendar, Users, MessageSquare, Compass} from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavigationMenuProps {
    currentRole: "owner" | "member"
    currentPath?: string
}

export function NavigationMenu({currentRole, currentPath}: NavigationMenuProps) {
    const menuItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: Home,
            active: currentPath === "/dashboard",
        },
        {
            title: "Events",
            href: "/dashboard/events",
            icon: Calendar,
            active: currentPath === "/dashboard/events",
        },
        {
            title: "Members",
            href: "/dashboard/members",
            icon: Users,
            active: currentPath === "/dashboard/members",
        },
        {
            title: "Messages",
            href: "/dashboard/messages",
            icon: MessageSquare,
            active: currentPath === "/dashboard/messages",
        },
    ]

    // Add Discover Clubs for members
    if (currentRole === "member") {
        menuItems.push({
            title: "Discover Clubs",
            href: "/dashboard/discover",
            icon: Compass,
            active: currentPath === "/dashboard/discover",
        })
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={item.active}>
                                <Link href={item.href}>
                                    <item.icon className="h-4 w-4"/>
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
