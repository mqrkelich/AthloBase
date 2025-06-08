"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useRouter} from "next/navigation";
import {getClubByInviteCode} from "@/app/dashboard/_actions/get-club"
import {joinClubWithInvite} from "@/app/dashboard/_actions/join-club"
import {toast} from "sonner";
import {truncate} from "@/lib/utils";

export default function MemberOnboardingPage() {
    const [inviteCode, setInviteCode] = useState("")
    const [isValidating, setIsValidating] = useState(false)
    const router = useRouter()
    const [clubFound, setClubFound] = useState<{
        name: string
        sport: string
        members: number
        description: string
    } | null>(null)

    const [doesExist, setDoesExist] = useState(true)

    const handleValidateCode = async () => {
        if (!inviteCode.trim()) return

        setIsValidating(true)

        const club = await getClubByInviteCode(inviteCode);
        if (!club) {
            setDoesExist(false)
            setClubFound(null)
            setIsValidating(false)
            return
        }

        setClubFound({
            name: club.name,
            sport: club.sport,
            members: club.memberCount || 0,
            description: club.description || "No description available",
        })

        setDoesExist(true)
        setIsValidating(false)


    }

    const handleJoinClub = async () => {
        await joinClubWithInvite(inviteCode).then((message) => {
            if (message.error) {
                toast.error(message.error)
                return;
            }

            router.replace('/dashboard');
            toast.success(message.success || "Successfully joined the club.")
        })
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link
                        href="/onboarding"
                        className="inline-flex items-center text-white/60 hover:text-white/80 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to role selection
                    </Link>
                    <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Join a Club</h2>
                    <p className="text-white/60">Enter your club invitation code to get started</p>
                </div>

                <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl mb-6">
                    <CardContent className="space-y-6 p-0">
                        <div className="space-y-2">
                            <Label htmlFor="inviteCode" className="text-white/80 text-sm font-medium">
                                Invitation Code
                            </Label>
                            <Input
                                id="inviteCode"
                                type="text"
                                placeholder="Enter your invitation code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                                onKeyDown={(e) => e.key === "Enter" && handleValidateCode()}
                            />
                            <p className="text-xs text-white/50">Ask your club administrator for the invitation code</p>
                        </div>

                        <Button
                            onClick={handleValidateCode}
                            disabled={!inviteCode.trim() || isValidating}
                            className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-medium transition-all duration-200"
                        >
                            {isValidating ? "Validating..." : "Find Club"}
                        </Button>
                    </CardContent>
                </Card>

                {clubFound && (
                    <Card className="bg-emerald-500/10 border-emerald-500/20 text-white rounded-2xl mb-6">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-emerald-500" />
                                <div>
                                    <CardTitle className="text-lg">Club Found!</CardTitle>
                                    <CardDescription className="text-emerald-200/70">You're invited to join this club</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl">
                                <h3 className="font-semibold text-lg mb-2">{clubFound.name}</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Sport:</span>
                                        <span>{clubFound.sport}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Members:</span>
                                        <span>{clubFound.members}</span>
                                    </div>
                                </div>
                                <p className="text-white/70 text-sm mt-3">
                                    {truncate(clubFound.description, 160)}
                                </p>
                            </div>

                            <Button
                                onClick={handleJoinClub}
                                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 h-12 rounded-xl font-medium transition-all duration-200"
                            >
                                Join {clubFound.name} →
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {!doesExist && (
                    <Card className="bg-red-500/10 border-red-500/20 text-white rounded-2xl mb-6">
                        <CardContent className="p-4">
                            <p className="text-red-200 text-sm">
                                Invalid invitation code. Please check with your club administrator and try again.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-zinc-900/30 border-white/5 text-white rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Demo Codes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                                <span className="text-white/60">San Francisco Runners:</span>
                                <code className="bg-white/10 px-2 py-1 rounded text-white">san-francisco</code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-8">
                    <p className="text-white/60 text-sm mb-2">Don't have an invitation code?</p>
                    <Link href="/onboarding/owner" className="text-white hover:text-white/80 font-medium transition-colors">
                        Create your own club instead →
                    </Link>
                </div>
            </div>
        </div>
    )
}
