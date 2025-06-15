import {type ReactNode, Suspense} from "react"

import MouseMoveEffect from "./_components/mouse-move-effect";
import Navbar from "@/app/(home)/_components/navbar";
import Footer from "@/app/(home)/_components/footer";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";

export default async function HomeLayout({children}: { children: ReactNode }) {

    const user = await getCurrentUser();
    const dbUser = user ? await getUserById(user.id!) : null;

    return (
        <main className="overflow-auto">

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

            <MouseMoveEffect/>
            <Suspense>{children}</Suspense>

            <Footer/>

        </main>


    )
}
