import { type ReactNode, Suspense } from "react"
import Link from "next/link"
import {
    Bell,
    Calendar,
    ChevronDown,
    Home,
    Layers,
    LogOut,
    MessageSquare,
    Plus,
    Search,
    Settings,
    User,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white">
            <SidebarProvider>
                {/* Sidebar */}
                <Sidebar className="border-r border-white/10">
                    <SidebarHeader className="p-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="logo.jpg" />
                            </Avatar>
                            <span className="font-bold text-lg">AthloBase</span>
                        </Link>
                    </SidebarHeader>

                    <SidebarContent>

                        <SidebarGroup>
                            <SidebarGroupLabel>Main</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive>
                                            <Link href="/dashboard">
                                                <Home className="h-4 w-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/events">
                                                <Calendar className="h-4 w-4" />
                                                <span>Events</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/members">
                                                <Users className="h-4 w-4" />
                                                <span>Members</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/messages">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>Messages</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* Clubs Navigation */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Your Clubs</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/clubs/city-runners">
                                                <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold">
                                                    C
                                                </div>
                                                <span>City Runners</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/clubs/metro-basketball">
                                                <div className="h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold">
                                                    M
                                                </div>
                                                <span>Metro Basketball</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/clubs/new">
                                                <Plus className="h-4 w-4" />
                                                <span>Create New Club</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* Settings Navigation */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Settings</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/settings/profile">
                                                <User className="h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/settings/account">
                                                <Settings className="h-4 w-4" />
                                                <span>Account</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start px-2">
                                    <Avatar className="h-8 w-8 mr-2">
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start text-sm">
                                        <span className="font-medium">John Doe</span>
                                        <span className="text-xs text-white/60">john@example.com</span>
                                    </div>
                                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content */}
                <div className="flex flex-col flex-1">
                    {/* Header */}
                    <header className="h-16 border-b border-white/10 bg-black/95 backdrop-blur-sm flex items-center px-4 sticky top-0 z-30">
                        <div className="flex items-center gap-4 w-full">
                            <SidebarTrigger />

                            {/* Club Selector */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2">
                                        <Layers className="h-4 w-4" />
                                        <span>City Runners</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>
                                        <div className="h-4 w-4 rounded-full bg-emerald-500 mr-2"></div>
                                        <span>City Runners</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <div className="h-4 w-4 rounded-full bg-orange-500 mr-2"></div>
                                        <span>Metro Basketball</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span>Create New Club</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Search */}
                            <div className="relative hidden md:flex flex-1 max-w-md">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-9 bg-zinc-800/50 border-white/10 focus-visible:ring-white/20 h-9 rounded-full"
                                />
                            </div>

                            <div className="ml-auto flex items-center gap-2">
                                {/* Mobile Search Button */}
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Search className="h-5 w-5" />
                                </Button>

                                {/* Notifications */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative">
                                            <Bell className="h-5 w-5" />
                                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80">
                                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <div className="max-h-80 overflow-auto">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-start gap-4 p-3 hover:bg-zinc-800/50 cursor-pointer">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback>U{i}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <p className="text-sm">New member joined City Runners</p>
                                                        <p className="text-xs text-white/60">2 hours ago</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <DropdownMenuSeparator />
                                        <div className="p-2">
                                            <Button variant="ghost" className="w-full justify-center text-sm">
                                                View all notifications
                                            </Button>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* User Menu (Mobile) */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="md:hidden">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto">
                        <Suspense>{children}</Suspense>
                    </main>
                </div>
            </SidebarProvider>
        </div>
    )
}
