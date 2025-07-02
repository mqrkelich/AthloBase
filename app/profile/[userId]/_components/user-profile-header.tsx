"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Edit, MessageCircle, UserPlus, Calendar, Users, TrendingUp, Flame } from "lucide-react"

interface UserProfileHeaderProps {
  user: {
    id: string
    name: string
    email: string
    image: string | null
    createdAt: Date
  }
  isOwnProfile: boolean
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

export function UserProfileHeader({ user, isOwnProfile, stats }: UserProfileHeaderProps) {
  const getPerformanceLevel = (attendanceRate: number) => {
    if (attendanceRate >= 90) return { level: "Elite", color: "bg-yellow-500/20 text-yellow-400", icon: "🏆" }
    if (attendanceRate >= 80) return { level: "High Performer", color: "bg-green-500/20 text-green-400", icon: "⭐" }
    if (attendanceRate >= 70) return { level: "Good", color: "bg-blue-500/20 text-blue-400", icon: "👍" }
    if (attendanceRate >= 60) return { level: "Average", color: "bg-gray-500/20 text-gray-400", icon: "📊" }
    return { level: "Needs Improvement", color: "bg-red-500/20 text-red-400", icon: "📈" }
  }

  const performance = getPerformanceLevel(stats.attendanceRate)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-teal-600/20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Avatar positioned over cover */}
        <div className="absolute -bottom-16 left-8">
          <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl">
            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-white/10 text-white text-2xl">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 pb-6 px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <Badge className={`${performance.color} border-0`}>
                {performance.icon} {performance.level}
              </Badge>
            </div>
            <p className="text-sm text-white/60">
              Member since{" "}
              {new Date(stats.memberSince).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <Button className="bg-white text-black hover:bg-white/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button className="bg-white text-black hover:bg-white/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-blue-400 mr-1" />
              <span className="text-2xl font-bold text-white">{stats.totalClubs}</span>
            </div>
            <p className="text-xs text-white/60">Clubs</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-2xl font-bold text-white">{stats.totalEvents}</span>
            </div>
            <p className="text-xs text-white/60">Events</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-400 mr-1" />
              <span className="text-2xl font-bold text-white">{stats.attendanceRate}%</span>
            </div>
            <p className="text-xs text-white/60">Attendance</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-4 w-4 text-orange-400 mr-1" />
              <span className="text-2xl font-bold text-white">{stats.currentStreak}</span>
            </div>
            <p className="text-xs text-white/60">Streak</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
