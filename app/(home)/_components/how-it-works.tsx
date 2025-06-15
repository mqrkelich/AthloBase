import {UserPlus, Settings, Play} from "lucide-react"

const steps = [
    {
        number: "1",
        title: "Create Your Account",
        description: "Sign up in seconds with just your email and password.",
        icon: UserPlus,
    },
    {
        number: "2",
        title: "Set Up Your Club",
        description: "Add your club details, invite members, and customize settings.",
        icon: Settings,
    },
    {
        number: "3",
        title: "Start Managing",
        description: "Schedule events, manage members, and grow your community.",
        icon: Play,
    },
]

export default function HowItWorks() {
    return (
        <section className="container space-y-16 py-24 md:py-32">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">How It Works</h2>
                <p className="mt-4 text-muted-foreground sm:text-lg">
                    Getting started with AthloBase is simple and straightforward.
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
                {steps.map((step, index) => (
                    <div key={step.number} className="relative flex flex-col items-center text-center">
                        {/* Step number */}
                        <div
                            className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border border-white/20">
                            <span className="text-2xl font-bold text-white">{step.number}</span>
                        </div>

                        {/* Icon */}
                        <div className="mb-4">
                            <step.icon className="h-8 w-8 text-white/70"/>
                        </div>

                        {/* Content */}
                        <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>


                    </div>
                ))}
            </div>
        </section>
    )
}
