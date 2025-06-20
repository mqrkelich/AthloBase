import Hero from "@/app/(home)/_components/hero";
import Features from "@/app/(home)/_components/features";
import HowItWorks from "@/app/(home)/_components/how-it-works";
import CTA from "@/app/(home)/_components/cta";

export default async function HomePage() {

    return (
        <div className="relative min-h-screen">
            <div className="pointer-events-none fixed inset-0">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"/>
            </div>

            <div className="relative z-10">

            <Hero/>
                <Features/>
                <HowItWorks/>
                <CTA/>

            </div>
        </div>
    )
}
