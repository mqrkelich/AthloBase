"use client"

import {ChevronDown, User, Settings, LogOut} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {SignOutButton} from "./sign-out"
import {getUserInitials} from "@/lib/helper/get-initials";

interface UserProfile {
    name: string
    avatar: string | null
}

interface UserProfileMenuProps {
    user: UserProfile
    onProfileClick?: () => void
    onSettingsClick?: () => void
}

export function UserProfileMenu({user, onProfileClick, onSettingsClick}: UserProfileMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                    <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name}/>
                        <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                        <span className="font-medium">{user.name}</span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={onProfileClick}>
                    <User className="mr-2 h-4 w-4"/>
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettingsClick}>
                    <Settings className="mr-2 h-4 w-4"/>
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <SignOutButton/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
