
import Link from "next/link"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/80 text-sm font-medium">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-white/60 hover:text-white/80 text-sm transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-medium transition-all duration-200"
              >
                Sign In →
              </Button>
            </form>


            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-4 text-white/60">or continue with</span>
              </div>
            </div>


            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-zinc-800/30 border-white/10 text-white hover:bg-zinc-800/50 hover:border-white/20 h-12 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>

              <Button
                variant="outline"
                className="w-full bg-zinc-800/30 border-white/10 text-white hover:bg-zinc-800/50 hover:border-white/20 h-12 rounded-xl transition-all duration-200"
              >
                <Github className="w-5 h-5 mr-3" />
                Sign in with GitHub
              </Button>
            </div>

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
