import {Target, Eye, Heart} from "lucide-react"

export default function Mission() {
    return (
        <section className="container space-y-16 py-24 md:py-32">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2">

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Target className="h-8 w-8 text-white"/>
                        <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        To empower sports clubs and teams with intuitive, powerful tools that simplify management tasks
                        and enhance
                        the athletic experience for everyone involved. We believe that great sports management software
                        should be
                        accessible, efficient, and built with the real needs of coaches, administrators, and athletes in
                        mind.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Eye className="h-8 w-8 text-white"/>
                        <h2 className="text-3xl font-bold text-white">Our Vision</h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        To become the global standard for sports club management, fostering stronger athletic
                        communities worldwide.
                        We envision a future where every sports organization, from local youth leagues to professional
                        clubs, has
                        access to world-class management tools that help them focus on what matters most: developing
                        athletes and
                        building community.
                    </p>
                </div>
            </div>

            {/* Story */}
            <div className="mx-auto max-w-4xl space-y-6 text-center">
                <div className="flex items-center justify-center gap-3">
                    <Heart className="h-8 w-8 text-white"/>
                    <h2 className="text-3xl font-bold text-white">My Story</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    AthloBase began during my time in the Neighborhood program, where I spent a month building real apps
                    alongside other young developers. Inspired by my own experiences in sports communities, I set out to
                    solve the messy, outdated systems clubs rely on. With a passion for both code and athletics, I
                    created AthloBase — a sleek, modern platform built to make sports management simple, intuitive, and
                    effective.
                </p>
            </div>
        </section>
    )
}
