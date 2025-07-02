"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Star, Users, Calendar } from "lucide-react"
import Link from "next/link"

interface Club {
  id: string
  name: string
  logo: string | null
  role: string
  joinedAt: Date
  attendanceRate: number
  eventsAttended: number
  totalEvents: number
}

interface UserProfileClubsProps {
  clubs: Club[]
}

export function UserProfileClubs({ clubs }: UserProfileClubsProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "admin":
        return <Star className="h-3 w-3 text-blue-400" />
      default:
        return null
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-500/20 text-yellow-500"
      case "admin":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-white/10 text-white/80"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-400" />
          Club Memberships ({clubs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clubs.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No club memberships</p>
            <p className="text-sm text-white/40">Join a club to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clubs.map((club) => (
              <Link
                key={club.id}
                href={`/dashboard/clubs/${club.id}`}
                className="block p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={club.logo || "/placeholder.svg"} alt={club.name} />
                    <AvatarFallback className="bg-white/10 text-white">{getInitials(club.name)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{club.name}</h3>
                      {getRoleIcon(club.role)}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs border-0 ${getRoleBadgeColor(club.role)}`}>{club.role}</Badge>
                      <span className="text-xs text-white/60">Joined {formatDate(club.joinedAt)}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Attendance Rate</span>
                        <span className="font-medium">{club.attendanceRate}%</span>
                      </div>
                      <Progress value={club.attendanceRate} className="h-1.5" />

                      <div className="flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {club.eventsAttended}/{club.totalEvents} events
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
