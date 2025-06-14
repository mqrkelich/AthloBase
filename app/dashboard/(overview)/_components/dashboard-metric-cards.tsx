import {TrendingUp, Calendar} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"

export function DashboardMetricCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Total Members</CardDescription>
                    <CardTitle className="text-2xl">128</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-emerald-500">
                        <TrendingUp className="mr-1 h-4 w-4"/>
                        <span>12% from last month</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="pb-2">
                    <CardDescription className="text-white/60">Active Clubs</CardDescription>
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
                    <CardTitle className="text-2xl">8</CardTitle>
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
                    <CardTitle className="text-2xl">87%</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Progress value={87} className="h-2 bg-white/10"/>
                        <span className="text-xs text-white/60 ml-2">+3%</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
