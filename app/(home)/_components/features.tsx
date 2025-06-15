import {Users, Calendar, Trophy, BarChart3} from "lucide-react"

const features = [
    {
        name: "Multi-Club Management",
        description: "Effortlessly manage multiple sports clubs and teams from a single, intuitive dashboard.",
        icon: Users,
    },
    {
        name: "Training & Events",
        description: "Schedule training sessions, matches, and events with automated notifications and reminders.",
        icon: Calendar,
    },
    {
        name: "Membership Management",
        description: "Track member registrations, renewals, and payments with comprehensive member profiles.",
        icon: Trophy,
    },
    {
        name: "Performance Analytics",
        description: "Gain insights into team performance, attendance rates, and club growth with detailed analytics.",
        icon: BarChart3,
    },
]

export default function Features() {
    return (
        <section className="container space-y-16 py-24 md:py-32">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                    Powerful Sports Management Features
                </h2>
                <p className="mt-4 text-muted-foreground sm:text-lg">
                    Everything you need to run successful sports clubs and teams, all in one platform.
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                {features.map((feature) => (
                    <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
                        <div className="flex items-center gap-4">
                            <feature.icon className="h-8 w-8"/>
                            <h3 className="font-bold">{feature.name}</h3>
                        </div>
                        <p className="mt-2 text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
