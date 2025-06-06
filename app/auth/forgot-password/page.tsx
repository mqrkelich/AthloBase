import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-2xl font-bold text-white tracking-tight">AthloBase</h1>
                    </Link>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-white">Reset your password</h2>
                            <p className="text-white/60">Enter your email and we'll send you a reset link</p>
                        </div>

                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/80 text-sm font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-medium transition-all duration-200"
                            >
                                Send Reset Link →
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center text-white/60 hover:text-white/80 text-sm transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
