import Image from "next/image"
import Link from "next/link"
import {ExternalLink} from "lucide-react"

export default function Team() {
    return (
        <section className="container space-y-16 py-24 md:py-32">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-white">Meet the
                    Founder</h2>
                <p className="mt-4 text-muted-foreground sm:text-lg">
                    The passionate individual behind AthloBase, driven by a love for sports and technology.
                </p>
            </div>
            <div className="mx-auto flex max-w-md justify-center">
                <div className="group text-center">
                    <div className="mb-6 overflow-hidden rounded-lg border border-white/10">
                        <Image
                            src="https://mqrkelich.com/images/avatar.png"
                            alt="Matias Markelic"
                            width={400}
                            height={400}
                            className="h-80 w-full object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-white">Matias Markelic</h3>
                    <p className="mb-3 text-lg font-medium text-white/70">Founder & Developer</p>
                    <p className="mb-4 text-muted-foreground">
                        Full-stack developer passionate about creating solutions that help sports communities thrive.
                        Building
                        AthloBase to solve real problems in sports club management.
                    </p>
                    <Link
                        href="https://mqrkelich.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    >
                        View Portfolio
                        <ExternalLink className="h-4 w-4"/>
                    </Link>
                </div>
            </div>
        </section>
    )
}
