import {TrendingUp, Calendar} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"

export function DashboardMemberMetrics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Events Attended</CardDescription>
                    <CardTitle className="text-2xl">24</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-emerald-500">
                        <TrendingUp className="mr-1 h-4 w-4"/>
                        <span>+6 this month</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">My Clubs</CardDescription>
                    <CardTitle className="text-2xl">2</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-white/60">
                        <span>City Runners, Metro Basketball</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Upcoming Events</CardDescription>
                    <CardTitle className="text-2xl">5</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-white/60">
                        <Calendar className="mr-1 h-4 w-4"/>
                        <span>Next: Tomorrow at 6:00 PM</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Attendance Rate</CardDescription>
                    <CardTitle className="text-2xl">94%</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Progress value={94} className="h-2 bg-white/10"/>
                        <span className="text-xs text-white/60 ml-2">Excellent!</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
