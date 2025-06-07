"use client"

import type { HTMLAttributes } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, User } from "lucide-react"
import {signOutAction} from "@/actions/login";
import {getUserInitials} from "@/lib/helper/get-initials"

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
    user?: {
        id: string
        name: string
        image?: string | null
    }
}

export function Header({ user }: HeaderProps) {
    const handleSignOut = async () => {
        await signOutAction();
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/80">
            <div className="container flex items-center justify-between h-16 px-4 md:px-6">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tight">AthloBase</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="#about" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        About
                    </Link>
                    <Link href="#community" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Community
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {user ? (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full p-0 "
                                >
                                    <Avatar className="h-10 w-10 overflow-hidden">
                                        {user.image ? <AvatarImage src={user.image} alt={user.name}/> : <AvatarFallback
                                            className="bg-white/10 text-white">{getUserInitials(user.name)}</AvatarFallback>}

                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 bg-black/90 border-white/10 backdrop-blur-md will-change-transform"
                                style={{ transform: "translateZ(0)" }}
                                align="end"
                                forceMount
                            >
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        <p className="font-medium text-white">{user.name}</p>
                                        <p className="w-[200px] truncate text-sm text-white/70">Welcome back!</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer">
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                    className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <Button variant="ghost" className="text-white/70 hover:text-white">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button className="bg-white text-black hover:bg-white/90">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
