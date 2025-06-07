import Link from "next/link"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"
import { LoginForm } from "./_components/login-form"
import SocialSignInButtons from "@/app/auth/_components/sign-in-button";

export default function LoginPage() {
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
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-white/60">Sign in to your account</p>
            </div>

            <LoginForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-4 text-white/60">or continue with</span>
              </div>
            </div>


            <SocialSignInButtons/>

            <div className="text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-white hover:text-white/80 font-medium transition-colors">
                  Register →
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/40 text-xs">Protected by industry-standard security measures</p>
        </div>
      </div>
    </div>
  )
}
