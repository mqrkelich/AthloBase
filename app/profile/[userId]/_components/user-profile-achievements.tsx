"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  unlockedAt: Date
}

interface UserProfileAchievementsProps {
  achievements: Achievement[]
}

export function UserProfileAchievements({ achievements }: UserProfileAchievementsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-400" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No achievements yet</p>
            <p className="text-sm text-white/40">Keep participating to unlock achievements!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{achievement.title}</h4>
                    <Badge className={`${achievement.color} border-0 text-xs`}>New</Badge>
                  </div>
                  <p className="text-sm text-white/70">{achievement.description}</p>
                  <p className="text-xs text-white/50 mt-1">Unlocked {formatDate(achievement.unlockedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
