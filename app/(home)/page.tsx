import Link from "next/link"
import { ArrowRight, CheckCircle, Layers, Calendar, Users, Settings, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-black text-white">

           <Header />

            <section className="pt-32 pb-24 md:pt-40 md:pb-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                            All Your Clubs. One Platform.
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 max-w-2xl">
                            Streamline training, events, and members with a tool built for modern sports communities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <Link href="/signup">
                                <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8">
                                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                                    Explore the Platform
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-24 bg-zinc-900">
                <div className="container px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Core Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <Layers className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Multi-Club Management</h3>
                            <p className="text-white/70">Create and switch between clubs with a single, unified dashboard.</p>
                        </div>

                        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Events & Training Scheduler</h3>
                            <p className="text-white/70">Organize practices, matches, and team events effortlessly.</p>
                        </div>

                        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Member Directory & Permissions</h3>
                            <p className="text-white/70">Manage roles, profiles, and invitations for every club member.</p>
                        </div>

                        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <Settings className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Fully Customizable</h3>
                            <p className="text-white/70">Set sport preferences, manage privacy, and tune settings per club.</p>
                        </div>

                        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <Github className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Free & Open Source</h3>
                            <p className="text-white/70">Built by and for the community. No fees. No limits.</p>
                        </div>

                        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Seamless Experience</h3>
                            <p className="text-white/70">Enjoy a smooth, intuitive interface designed for efficiency.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-white/70 text-lg">Getting started with AthloBase is simple and straightforward.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-2xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-3">Create Your Account</h3>
                            <p className="text-white/70">Sign up in seconds with just your email and password.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-2xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-3">Set Up Your Club</h3>
                            <p className="text-white/70">Add your club details, invite members, and customize settings.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-2xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-3">Start Managing</h3>
                            <p className="text-white/70">Schedule events, manage members, and grow your community.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-b from-zinc-900 to-black">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold">Ready to simplify your club management?</h2>
                        <p className="text-xl text-white/70">
                            Join thousands of sports clubs already using our platform to streamline their operations.
                        </p>
                        <Link href="/signup" className="inline-block">
                            <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8 text-lg">
                                Create Your First Club <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
