import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"

export function DashboardActivityFeed() {
    // Mock activity data
    const activities = [
        {
            id: 1,
            user: {name: "Sarah Lee", avatar: "SL"},
            action: "joined",
            target: "City Runners",
            time: "2 hours ago",
        },
        {
            id: 2,
            user: {name: "Mike Johnson", avatar: "MJ"},
            action: "created a new event",
            target: "Weekend Trail Run",
            time: "Yesterday",
        },
        {
            id: 3,
            user: {name: "Tom Wilson", avatar: "TW"},
            action: "updated the venue for",
            target: "League Match",
            time: "2 days ago",
        },
        {
            id: 4,
            user: {name: "Anna Parker", avatar: "AP"},
            action: "posted in",
            target: "Metro Basketball discussion",
            time: "3 days ago",
        },
        {
            id: 5,
            user: {name: "James Smith", avatar: "JS"},
            action: "reached a milestone in",
            target: "City Runners",
            time: "4 days ago",
        },
    ]

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription className="text-white/60">Latest updates from your clubs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={`/placeholder.svg?height=32&width=32&text=${activity.user.avatar}`}
                                    alt={activity.user.name}
                                />
                                <AvatarFallback>{activity.user.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm">
                                    <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                                    <span className="font-medium">{activity.target}</span>
                                </p>
                                <p className="text-xs text-white/60">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4">
                <Button variant="ghost" className="w-full text-white/60 hover:text-white">
                    View All Activity
                </Button>
            </CardFooter>
        </Card>
    )
}
