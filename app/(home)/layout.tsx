import {type ReactNode, Suspense} from "react"

import MouseMoveEffect from "./_components/mouse-move-effect";

export default async function HomeLayout({children}: { children: ReactNode }) {

    return (
        <main className="overflow-auto">
            <MouseMoveEffect/>
            <Suspense>{children}</Suspense>
        </main>


    )
}
