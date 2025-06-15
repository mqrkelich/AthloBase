import AboutHero from "@/app/(home)/_components/about/about-hero";
import Mission from "@/app/(home)/_components/about/mission";
import Team from "@/app/(home)/_components/about/team";
import Values from "@/app/(home)/_components/about/values";
import CTA from "@/app/(home)/_components/cta";

export default function AboutPage() {
    return (
        <div className="relative min-h-screen">
            <div className="pointer-events-none fixed inset-0">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"/>
            </div>

            <div className="relative z-10">

                <AboutHero/>
                <Mission/>
                <Team/>
                <Values/>
                <CTA/>

            </div>
        </div>
    )
}
