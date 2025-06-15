import {Users, Zap, Shield, Trophy} from "lucide-react"

const values = [
    {
        name: "Community First",
        description: "We prioritize the needs of sports communities and build features that bring people together.",
        icon: Users,
    },
    {
        name: "Innovation",
        description: "We continuously push boundaries to deliver cutting-edge solutions for modern sports management.",
        icon: Zap,
    },
    {
        name: "Reliability",
        description: "Sports organizations depend on us, so we maintain the highest standards of security and uptime.",
        icon: Shield,
    },
    {
        name: "Excellence",
        description: "We strive for excellence in everything we do, from product design to customer support.",
        icon: Trophy,
    },
]

export default function Values() {
    return (
        <section className="border-t border-white/10 py-24 md:py-32">
            <div className="container space-y-16">
                <div className="mx-auto max-w-[58rem] text-center">
                    <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-white">Our Values</h2>
                    <p className="mt-4 text-muted-foreground sm:text-lg">
                        The principles that guide everything we do at AthloBase.
                    </p>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                    {values.map((value, index) => (
                        <div key={index}
                             className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <value.icon className="h-8 w-8 text-white"/>
                                <h3 className="font-bold text-xl text-white">{value.name}</h3>
                            </div>
                            <p className="text-muted-foreground">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
