import {Button} from "@/components/ui/button"
import {ArrowRight} from "lucide-react"
import Link from "next/link"

export default function Hero() {
    return (
        <section
            className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
            <div className="space-y-4">
                <h1 className="bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                    Manage Your Sports Teams
                    <br/>
                    Like a Pro
                </h1>
                <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    AthloBase is the ultimate club and sports team management platform. Manage multiple clubs, training
                    sessions,
                    events, and memberships all from one centralized dashboard.
                </p>
            </div>
            <div className="flex gap-4">
                <Link href="/auth/register">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90">
                        Register Now
                        <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </Link>
                <Link href="/about">
                    <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                        About Us
                    </Button>
                </Link>
            </div>
        </section>
    )
}
