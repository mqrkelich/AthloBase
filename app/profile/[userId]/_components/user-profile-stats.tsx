"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Flame, Trophy, Calendar, Clock } from "lucide-react"

interface UserProfileStatsProps {
  stats: {
    totalClubs: number
    totalEvents: number
    attendanceRate: number
    currentStreak: number
    longestStreak: number
    totalAttendance: number
    memberSince: Date
  }
}

export function UserProfileStats({ stats }: UserProfileStatsProps) {
  const getPerformanceLevel = (attendanceRate: number) => {
    if (attendanceRate >= 90) return { level: "Elite", color: "text-yellow-400" }
    if (attendanceRate >= 80) return { level: "High Performer", color: "text-green-400" }
    if (attendanceRate >= 70) return { level: "Good", color: "text-blue-400" }
    if (attendanceRate >= 60) return { level: "Average", color: "text-gray-400" }
    return { level: "Needs Improvement", color: "text-red-400" }
  }

  const performance = getPerformanceLevel(stats.attendanceRate)
  const membershipDays = Math.floor((new Date().getTime() - stats.memberSince.getTime()) / (1000 * 60 * 60 * 24))
  const eventsPerWeek = stats.totalEvents > 0 ? ((stats.totalEvents / membershipDays) * 7).toFixed(1) : "0"

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          Performance Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Attendance Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Attendance Rate</span>
            <Badge className={`${performance.color} bg-transparent border-current`}>{performance.level}</Badge>
          </div>
          <Progress value={stats.attendanceRate} className="h-2" />
          <p className="text-2xl font-bold">{stats.attendanceRate}%</p>
        </div>

        {/* Current Streak */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <div>
              <p className="text-sm text-white/70">Current Streak</p>
              <p className="text-xl font-bold">{stats.currentStreak}</p>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm text-white/70">Longest Streak</p>
              <p className="text-xl font-bold">{stats.longestStreak}</p>
            </div>
          </div>
        </div>

        {/* Events Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-white">Events Breakdown</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded bg-green-500/10 border border-green-500/20">
              <p className="text-lg font-bold text-green-400">{stats.totalAttendance}</p>
              <p className="text-xs text-white/60">Attended</p>
            </div>
            <div className="text-center p-2 rounded bg-red-500/10 border border-red-500/20">
              <p className="text-lg font-bold text-red-400">{stats.totalEvents - stats.totalAttendance}</p>
              <p className="text-xs text-white/60">Missed</p>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-white/70">Events per week</span>
            </div>
            <span className="font-medium">{eventsPerWeek}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-white/70">Member for</span>
            </div>
            <span className="font-medium">{membershipDays} days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
