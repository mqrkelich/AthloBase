"use client";

import Link from "next/link"
import {usePathname} from "next/navigation"
import {User, Settings} from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SettingsNavigation() {
    const currentPath = usePathname(); // Get current path inside client component

    const settingsItems = [
        {
            title: "Profile",
            href: "/dashboard/settings/profile",
            icon: User,
            active: currentPath === "/dashboard/settings/profile",
        },
        {
            title: "Account",
            href: "/dashboard/settings/account",
            icon: Settings,
            active: currentPath === "/dashboard/settings/account",
        },
    ]

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {settingsItems.map((item) => (
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
