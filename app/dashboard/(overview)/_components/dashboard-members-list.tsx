import {ChevronRight} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"

export function DashboardMembersList() {
    const newMembers = [
        {name: "Alex Morgan", days: 1, club: "City Runners"},
        {name: "Jamie Smith", days: 2, club: "Metro Basketball"},
        {name: "Taylor Reed", days: 3, club: "City Runners"},
        {name: "Casey Jones", days: 4, club: "Metro Basketball"},
    ]

    return (
        <Card className="bg-zinc-900/50 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>New Members</CardTitle>
                    <CardDescription className="text-white/60">Recently joined</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <Link href="/dashboard/members">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {newMembers.map((member, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-white/60">
                                        Joined {member.club} • {member.days} day{member.days > 1 ? "s" : ""} ago
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" asChild>
                                <Link href={`/dashboard/members/${member.name.toLowerCase().replace(" ", "-")}`}>
                                    <ChevronRight className="h-4 w-4"/>
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
