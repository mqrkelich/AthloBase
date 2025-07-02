"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Users, CheckCircle, XCircle, Award } from "lucide-react"

type ActivityType = "club_joined" | "event_attended" | "event_missed" | "achievement_unlocked"

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: Date
  clubName?: string
  icon: string
  color: string
}

interface UserProfileActivityProps {
  activities: ActivityItem[]
}

export function UserProfileActivity({ activities }: UserProfileActivityProps) {
  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return <Users className="h-4 w-4" />
      case "CheckCircle":
        return <CheckCircle className="h-4 w-4" />
      case "XCircle":
        return <XCircle className="h-4 w-4" />
      case "Award":
        return <Award className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No recent activity</p>
            <p className="text-sm text-white/40">Activity will appear here as you participate in events</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className={`${activity.color} mt-0.5`}>{getActivityIcon(activity.icon)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <span className="text-xs text-white/50">{getRelativeTime(activity.timestamp)}</span>
                  </div>

                  <p className="text-sm text-white/70 mb-1">{activity.description}</p>

                  {activity.clubName && (
                    <Badge className="bg-white/10 text-white/80 border-0 text-xs">{activity.clubName}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
