"use client"

import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Github, LogOut, Settings, User} from "lucide-react"
import type {HTMLAttributes} from "react";
import {signOutAction} from "@/actions/login";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getUserInitials} from "@/lib/helper/get-initials";

interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
    user?: {
        id: string
        name: string
        image?: string | null
    }
}

export default function Navbar({user}: NavbarProps) {

    const handleSignOut = async () => {
        await signOutAction();
    }

    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold text-white">AthloBase</span>
                </Link>
                <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
                    <Link href="/about" className="text-white/70 transition-colors hover:text-white">
                        About
                    </Link>
                    <Link target="_blank" href="https://github.com/mqrkelich/AthloBase/blob/main/README.md"
                          className="text-white/70 transition-colors hover:text-white">
                        Documentation
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <Link href="https://github.com/mqrkelich/AthloBase" target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon"
                                className="text-white/70 hover:text-white hover:bg-white/10">
                            <Github className="h-4 w-4"/>
                            <span className="sr-only">GitHub</span>
                        </Button>
                    </Link>

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
                                style={{transform: "translateZ(0)"}}
                                align="end"
                                forceMount
                            >
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        <p className="font-medium text-white">{user.name}</p>
                                        <p className="w-[200px] truncate text-sm text-white/70">Welcome back!</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="bg-white/10"/>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer"
                                    >
                                        <Settings className="h-4 w-4"/>
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile"
                                          className="flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer">
                                        <User className="h-4 w-4"/>
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10"/>
                                <DropdownMenuItem
                                    className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4"/>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <Button variant="ghost" size="sm"
                                        className="text-white/70 hover:text-white hover:bg-white/10">
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
