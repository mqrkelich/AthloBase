import { HTMLAttributes } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";


interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
    user?: {
        id: string;
        name: string;
    };
}

export function Header({
                           user,
                       }: HeaderProps) {
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
                    <Link href="/login">
                        <Button variant="ghost" className="text-white/70 hover:text-white">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-white text-black hover:bg-white/90">Sign Up</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
