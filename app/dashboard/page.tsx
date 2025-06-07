import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import {notFound, redirect,} from "next/navigation";

export default async function DashboardPage() {

    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!user) {
        return notFound();
    }

    if(user.onboarding) redirect('/onboarding')

    return (
        <div className="p-6 space-y-8">


            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-white/60">Welcome back, {user.name}. Here's what's happening with your clubs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        <Plus className="mr-2 h-4 w-4" />
                        New Event
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Invite Members
                    </Button>
                </div>
            </div>


        </div>
    )
}
