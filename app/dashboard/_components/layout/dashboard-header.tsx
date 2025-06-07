import {Search, Bell, User, Settings, LogOut} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {ClubSelector} from "@/app/dashboard/_components/layout/club-selector";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import {notFound} from "next/navigation";
import {getUserClubs} from "@/app/dashboard/_actions/user-data";

interface DashboardHeaderProps {
    currentRole: "owner" | "member"
}

export async function DashboardHeader({currentRole}: DashboardHeaderProps) {

    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!user) {
        return notFound();
    }

    const userClubs = await getUserClubs(user.id, currentRole);


    const clubs = userClubs ? userClubs.map(club => ({
        id: club.id,
        name: club.name,
        role: currentRole,
    })) : [];

    const selectedClub = clubs.length > 0 ? clubs[0] : {id: "default", name: "Select a club", role: currentRole};

    return (
        <header
            className="h-16 border-b border-white/10 bg-black/95 backdrop-blur-sm flex items-center px-4 sticky top-0 z-30">
            <div className="flex items-center gap-4 w-full">
                <SidebarTrigger/>

                <ClubSelector clubs={clubs} selectedClub={selectedClub} currentRole={currentRole}/>

                {/* Search */}
                <div className="relative hidden md:flex flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50"/>
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 bg-zinc-800/50 border-white/10 focus-visible:ring-white/20 h-9 rounded-full"
                    />
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {/* Mobile Search Button */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Search className="h-5 w-5"/>
                    </Button>

                    {/* Notifications */}
                    <NotificationsDropdown currentRole={currentRole}/>

                    {/* User Menu (Mobile) */}
                    <MobileUserMenu/>
                </div>
            </div>
        </header>
    )
}

function NotificationsDropdown({currentRole}: { currentRole: "owner" | "member" }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5"/>
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <div className="max-h-80 overflow-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4 p-3 hover:bg-zinc-800/50 cursor-pointer">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="text-sm">
                                    New member joined {currentRole === "owner" ? "City Runners" : "Weekend Warriors"}
                                </p>
                                <p className="text-xs text-white/60">2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
                <DropdownMenuSeparator/>
                <div className="p-2">
                    <Button variant="ghost" className="w-full justify-center text-sm">
                        View all notifications
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function MobileUserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User"/>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4"/>
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4"/>
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
