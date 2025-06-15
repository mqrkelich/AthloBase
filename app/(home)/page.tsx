import { getUserById } from "@/data/user";
import { getCurrentUser } from "@/lib/helper/session";
import Navbar from "@/app/(home)/_components/navbar";
import Hero from "@/app/(home)/_components/hero";
import Features from "@/app/(home)/_components/features";
import HowItWorks from "@/app/(home)/_components/how-it-works";
import CTA from "@/app/(home)/_components/cta";
import Footer from "@/app/(home)/_components/footer";

export default async function HomePage() {

    const user = await getCurrentUser();
    const dbUser = user ? await getUserById(user.id!) : null;

    return (
        <div className="relative min-h-screen">
            <div className="pointer-events-none fixed inset-0">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"/>
            </div>

            <div className="relative z-10">
                <Navbar
                    user={
                        dbUser
                            ? {
                                id: dbUser.id,
                                name: dbUser.name ?? "Anonymous",
                                image: dbUser.image ?? null,
                            }
                            : undefined
                    }
                />
                <Hero/>
                <Features/>
                <HowItWorks/>
                <CTA/>
                <Footer/>
            </div>
        </div>
    )
}
