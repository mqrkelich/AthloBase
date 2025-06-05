import Link from "next/link"
import { ArrowRight, CheckCircle, Layers, Calendar, Users, Settings, Github } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
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

      {/* Hero Section */}
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

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Club Management</h3>
              <p className="text-white/70">Create and switch between clubs with a single, unified dashboard.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Events & Training Scheduler</h3>
              <p className="text-white/70">Organize practices, matches, and team events effortlessly.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Member Directory & Permissions</h3>
              <p className="text-white/70">Manage roles, profiles, and invitations for every club member.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fully Customizable</h3>
              <p className="text-white/70">Set sport preferences, manage privacy, and tune settings per club.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-zinc-800/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px]">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Github className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Free & Open Source</h3>
              <p className="text-white/70">Built by and for the community. No fees. No limits.</p>
            </div>

            {/* Feature 6 */}
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

      {/* How It Works Section */}
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

      {/* Final CTA Section */}
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

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">AthloBase</h3>
              <p className="text-white/70">The modern platform for sports club management.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-white/70 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white">
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-white/70 hover:text-white">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white">
                    Twitter
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-white/70 hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/70 hover:text-white">
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50">
            <p>© {new Date().getFullYear()} AthloBase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
