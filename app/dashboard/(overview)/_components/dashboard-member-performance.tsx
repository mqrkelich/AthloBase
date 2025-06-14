import {Trophy, Target, TrendingUp, Award} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import {Badge} from "@/components/ui/badge"

export function DashboardMemberPerformance() {
    // Mock performance data
    const performanceData = {
        "city-runners": {
            name: "City Runners",
            color: "emerald",
            metrics: [
                {label: "Distance This Month", value: "127", unit: "km", progress: 85, target: "150 km"},
                {label: "Personal Best 5K", value: "22:45", unit: "min", improvement: "+15s"},
                {label: "Training Sessions", value: "12", unit: "sessions", progress: 80, target: "15 sessions"},
            ],
            achievements: ["Consistency Champion", "Distance Milestone"],
        },
        "metro-basketball": {
            name: "Metro Basketball",
            color: "orange",
            metrics: [
                {label: "Games Played", value: "8", unit: "games", progress: 67, target: "12 games"},
                {label: "Points Average", value: "18.5", unit: "pts", improvement: "+2.3"},
                {label: "Free Throw %", value: "78", unit: "%", improvement: "+5%"},
            ],
            achievements: ["Team Player", "Scoring Streak"],
        },
    }

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500"/>
                    My Performance
                </CardTitle>
                <CardDescription className="text-white/60">Your progress and achievements across clubs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.entries(performanceData).map(([clubId, data]) => (
                    <div key={clubId} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className={`font-medium text-${data.color}-500`}>{data.name}</h3>
                            <div className="flex gap-1">
                                {data.achievements.map((achievement, index) => (
                                    <Badge key={index} variant="outline"
                                           className="bg-yellow-500/20 text-yellow-500 border-0 text-xs">
                                        <Award className="mr-1 h-3 w-3"/>
                                        {achievement}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {data.metrics.map((metric, index) => (
                                <div key={index} className="bg-white/5 p-3 rounded-lg">
                                    <div className="text-white/60 text-xs mb-1">{metric.label}</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold">{metric.value}</span>
                                        <span className="text-xs text-white/60">{metric.unit}</span>
                                        {metric.improvement && (
                                            <span className="text-xs text-emerald-500 flex items-center ml-auto">
                        <TrendingUp className="h-3 w-3 mr-1"/>
                                                {metric.improvement}
                      </span>
                                        )}
                                    </div>
                                    {metric.progress && (
                                        <div className="mt-2">
                                            <div
                                                className="flex items-center justify-between text-xs text-white/60 mb-1">
                                                <span>Progress</span>
                                                <span>{metric.target}</span>
                                            </div>
                                            <Progress
                                                value={metric.progress}
                                                className="h-1.5 bg-white/10"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Target className="h-4 w-4"/>
                            <span>Monthly Goals Progress</span>
                        </div>
                        <span className="text-xs text-emerald-500">On track!</span>
                    </div>
                    <Progress value={76} className="h-2 bg-white/10 mt-2"/>
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>76% complete</span>
                        <span>8 days remaining</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
