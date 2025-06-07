import Link from "next/link"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
} from "@/components/ui/sidebar"
import {RoleSwitcher} from "./role-switcher"
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import {notFound} from "next/navigation";
import {getUserClubs} from "@/app/dashboard/_actions/user-data";
import {UserProfileMenu} from "./user-profile-menu"
import {NavigationMenu} from "@/app/dashboard/_components/layout/navigation-menu";
import {ClubsNavigation} from "@/app/dashboard/_components/layout/clubs-navigation";
import {SettingsNavigation} from "@/app/dashboard/_components/layout/settings-navigation";

interface DashboardSidebarProps {
    currentRole: "owner" | "member"
    userRoles: string[]
}

export async function DashboardSidebar({currentRole, userRoles}: DashboardSidebarProps) {

    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!user) {
        return notFound();
    }

    const userClubs = await getUserClubs(user.id, currentRole);

    const mappedClubs = userClubs ? userClubs.map(club => ({
        id: club.id,
        name: club.name,
        href: `/dashboard/clubs/${club.id}`,
        logo: club.logo || undefined,
        role: currentRole,
    })) : [];

    return (
        <Sidebar className="border-r border-white/10">
            <SidebarHeader className="p-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-bold text-lg">AthloBase</span>
                </Link>
            </SidebarHeader>

            <SidebarContent>

                {userRoles.length > 1 && (
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <RoleSwitcher currentRole={currentRole}/>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                <NavigationMenu currentRole={currentRole}/>
                <ClubsNavigation clubs={mappedClubs} currentRole={currentRole}/>
                <SettingsNavigation/>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <UserProfileMenu user={{avatar: user.image, name: user.name || "Unknown"}}/>
            </SidebarFooter>
        </Sidebar>
    )
}
