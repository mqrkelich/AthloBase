export default function AboutHero() {
    return (
        <section
            className="container flex min-h-[60vh] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
            <div className="space-y-6">
                <h1 className="bg-gradient-to-br from-white via-white to-white/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
                    About AthloBase
                </h1>
                <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    We're on a mission to revolutionize how sports clubs and teams manage their operations, connect with
                    members,
                    and build thriving athletic communities.
                </p>
            </div>
        </section>
    )
}
