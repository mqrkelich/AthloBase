"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Crown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
    const [selectedRole, setSelectedRole] = useState<"owner" | "member" | null>(null)

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="text-2xl font-bold text-white tracking-tight">AthloBase</h1>
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome to AthloBase!</h2>
                    <p className="text-white/60 text-lg">Let's get you set up. How would you like to get started?</p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    <Card
                        className={`bg-zinc-900/50 border-white/10 text-white cursor-pointer transition-all duration-200 hover:border-white/30 hover:bg-zinc-900/70 ${
                            selectedRole === "owner" ? "border-white/50 bg-zinc-900/80" : ""
                        }`}
                        onClick={() => setSelectedRole("owner")}
                    >
                        <CardHeader className="text-center pb-4">
                            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                <Crown className="h-8 w-8 text-emerald-500" />
                            </div>
                            <CardTitle className="text-xl">I'm a Club Owner</CardTitle>
                            <CardDescription className="text-white/60">Create and manage your own sports club</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <ul className="text-sm text-white/70 space-y-2">
                                <li>• Create your club from scratch</li>
                                <li>• Invite and manage members</li>
                                <li>• Schedule events and training</li>
                                <li>• Full administrative control</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card
                        className={`bg-zinc-900/50 border-white/10 text-white cursor-pointer transition-all duration-200 hover:border-white/30 hover:bg-zinc-900/70 ${
                            selectedRole === "member" ? "border-white/50 bg-zinc-900/80" : ""
                        }`}
                        onClick={() => setSelectedRole("member")}
                    >
                        <CardHeader className="text-center pb-4">
                            <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-blue-500" />
                            </div>
                            <CardTitle className="text-xl">I'm a Club Member</CardTitle>
                            <CardDescription className="text-white/60">Join an existing sports club</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <ul className="text-sm text-white/70 space-y-2">
                                <li>• Join with an invitation code</li>
                                <li>• View club events and activities</li>
                                <li>• Connect with other members</li>
                                <li>• Participate in club discussions</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Button
                        className="w-full max-w-md bg-white text-black hover:bg-white/90 h-12 rounded-xl font-medium transition-all duration-200"
                        disabled={!selectedRole}
                        asChild
                    >
                        <Link href={selectedRole ? `/onboarding/${selectedRole}` : "#"}>Continue →</Link>
                    </Button>

                </div>

                <div className="text-center mt-12">
                    <p className="text-white/40 text-xs">You can always change your role or create additional clubs later</p>
                </div>
            </div>
        </div>
    )
}
