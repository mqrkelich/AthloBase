import {Crown} from "lucide-react"

export function CreateClubHeader() {
    return (
        <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-emerald-500"/>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Your Club</h1>
            <p className="text-white/60">Set up your sports club step by step</p>
        </div>
    )
}
