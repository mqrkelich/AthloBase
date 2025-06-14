import {CheckCircle2, Users, Calendar} from "lucide-react"

interface DashboardAttendanceStatsProps {
    clubId: string
}

export function DashboardAttendanceStats({clubId}: DashboardAttendanceStatsProps) {
    // Mock data - in a real app, this would come from your API
    const stats = {
        "city-runners": {
            lastEvent: {
                name: "Morning Run",
                date: "June 10",
                attendance: 85,
                total: 76,
                attended: 65,
            },
            thisMonth: {
                events: 12,
                avgAttendance: 92,
            },
        },
        "metro-basketball": {
            lastEvent: {
                name: "Practice Session",
                date: "June 9",
                attendance: 78,
                total: 52,
                attended: 41,
            },
            thisMonth: {
                events: 8,
                avgAttendance: 84,
            },
        },
    }

    const clubStats = stats[clubId as keyof typeof stats]

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-white/70">Attendance Statistics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-white/60 text-xs">Last Event</div>
                            <div className="font-medium mt-1">{clubStats.lastEvent.name}</div>
                            <div className="text-xs text-white/60 mt-1">{clubStats.lastEvent.date}</div>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
                            <CheckCircle2 className="h-3 w-3 text-green-500"/>
                            <span className="text-xs font-medium">{clubStats.lastEvent.attendance}% attended</span>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3"/>
                            <span>
                {clubStats.lastEvent.attended}/{clubStats.lastEvent.total} members
              </span>
                        </div>
                        <span className="text-white/40">View details →</span>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-white/60 text-xs">This Month</div>
                            <div className="font-medium mt-1">{clubStats.thisMonth.events} Events</div>
                            <div className="text-xs text-white/60 mt-1">Avg. {clubStats.thisMonth.avgAttendance}%
                                attendance
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
                            <Calendar className="h-3 w-3 text-blue-400"/>
                            <span className="text-xs font-medium">{clubStats.thisMonth.events} total</span>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3"/>
                            <span>Consistent attendance</span>
                        </div>
                        <span className="text-white/40">View report →</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
