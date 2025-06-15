import {Button} from "@/components/ui/button"
import Link from "next/link";

export default function CTA() {
    return (
        <section className="border-t">
            <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                    Ready to transform your sports management?
                </h2>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Join thousands of sports clubs and teams who trust AthloBase to streamline their operations and
                    focus on what
                    matters most - the game.
                </p>

                <Link href="/auth/register">
                    <Button size="lg" className="mt-4">
                        Register Now
                    </Button>
                </Link>

            </div>
        </section>
    )
}
