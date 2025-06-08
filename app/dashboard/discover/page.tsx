"use client"

import Link from "next/link"
import {Search, MapPin, Users, Calendar, Star, ArrowRight, Filter, Plus, CheckCircle} from "lucide-react"
import {useState} from "react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {joinClubWithInvite} from "@/app/dashboard/_actions/join-club";
import {toast} from "sonner";
import {getClubByInviteCode} from "@/app/dashboard/_actions/get-club";
import {useRouter} from "next/navigation";
import {truncate} from "@/lib/utils";

// Mock data for public clubs
const publicClubs = [
    {
        id: "sunrise-runners",
        name: "Sunrise Runners",
        sport: "Running",
        description:
            "Early morning running group for fitness enthusiasts. We meet every weekday at 6 AM for a refreshing start to the day.",
        location: "Central Park, NYC",
        members: 124,
        rating: 4.8,
        meetingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        skillLevel: "Mixed",
        ageGroup: "Adult",
        image: "/placeholder.svg?height=200&width=400",
        owner: "Sarah Johnson",
        recentActivity: "2 hours ago",
        tags: ["Morning", "Fitness", "Community"],
    },
    {
        id: "downtown-basketball",
        name: "Downtown Basketball League",
        sport: "Basketball",
        description:
            "Competitive basketball league for intermediate to advanced players. Weekly games and monthly tournaments.",
        location: "Downtown Sports Complex",
        members: 89,
        rating: 4.6,
        meetingDays: ["Wed", "Sat"],
        skillLevel: "Intermediate",
        ageGroup: "Adult",
        image: "/placeholder.svg?height=200&width=400",
        owner: "Mike Chen",
        recentActivity: "1 day ago",
        tags: ["Competitive", "League", "Tournament"],
    },
    {
        id: "weekend-cyclists",
        name: "Weekend Cyclists",
        sport: "Cycling",
        description:
            "Casual cycling group exploring scenic routes around the city. Perfect for beginners and experienced cyclists alike.",
        location: "Various Routes",
        members: 67,
        rating: 4.9,
        meetingDays: ["Sat", "Sun"],
        skillLevel: "Beginner",
        ageGroup: "All Ages",
        image: "/placeholder.svg?height=200&width=400",
        owner: "Emma Davis",
        recentActivity: "3 hours ago",
        tags: ["Scenic", "Beginner-Friendly", "Weekend"],
    },
    {
        id: "tennis-masters",
        name: "Tennis Masters",
        sport: "Tennis",
        description: "Advanced tennis club for serious players. Regular coaching sessions and competitive matches.",
        location: "Elite Tennis Center",
        members: 45,
        rating: 4.7,
        meetingDays: ["Tue", "Thu", "Sat"],
        skillLevel: "Advanced",
        ageGroup: "Adult",
        image: "/placeholder.svg?height=200&width=400",
        owner: "David Wilson",
        recentActivity: "5 hours ago",
        tags: ["Advanced", "Coaching", "Competitive"],
    },
    {
        id: "family-soccer",
        name: "Family Soccer Club",
        sport: "Soccer",
        description:
            "Fun soccer activities for families with children. Teaching kids the basics while parents can join in too!",
        location: "Community Park Fields",
        members: 156,
        rating: 4.5,
        meetingDays: ["Sat", "Sun"],
        skillLevel: "Beginner",
        ageGroup: "All Ages",
        image: "/placeholder.svg?height=200&width=400",
        owner: "Lisa Rodriguez",
        recentActivity: "1 hour ago",
        tags: ["Family", "Kids", "Fun"],
    },
    {
        id: "swimming-enthusiasts",
        name: "Swimming Enthusiasts",
        sport: "Swimming",
        description: "Swimming club for all levels. From learning strokes to competitive training, we welcome everyone.",
        location: "Aquatic Center",
        members: 78,
        rating: 4.4,
        meetingDays: ["Mon", "Wed", "Fri"],
        skillLevel: "Mixed",
        ageGroup: "Adult",
        image: "/placeholder.svg?height=200&width=400",
        owner: "Tom Anderson",
        recentActivity: "4 hours ago",
        tags: ["Swimming", "Training", "All Levels"],
    },
]

export default function DiscoverClubsPage() {
    const [showInviteDialog, setShowInviteDialog] = useState(false)
    const [inviteCode, setInviteCode] = useState("")
    const [isValidating, setIsValidating] = useState(false)
    const router = useRouter()
    const [clubFound, setClubFound] = useState<{
        name: string
        sport: string
        members: number
        description: string
    } | null>(null)

    const [doesExist, setDoesExist] = useState(true)

    const handleValidateCode = async () => {
        if (!inviteCode.trim()) return

        setIsValidating(true)

        const club = await getClubByInviteCode(inviteCode);
        if (!club) {
            setDoesExist(false)
            setClubFound(null)
            setIsValidating(false)
            return
        }

        setClubFound({
            name: club.name,
            sport: club.sport,
            members: club.memberCount || 0,
            description: club.description || "No description available",
        })

        setDoesExist(true)
        setIsValidating(false)
        setShowInviteDialog(true) // Show the dialog if club is found


    }

    const handleJoinClub = async () => {
        await joinClubWithInvite(inviteCode).then((message) => {
            if (message.error) {
                toast.error(message.error)
                return;
            }

            router.refresh();
            toast.success(message.success || "Successfully joined the club.")
        })
    }

    const resetInviteDialog = () => {
        setInviteCode("")
        setClubFound(null)
        setIsValidating(false)
        setShowInviteDialog(false)
    }

    return (
        <div className="p-6 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Discover Clubs</h1>
                    <p className="text-white/60">Find and join public sports clubs in your area</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowInviteDialog(true)}
                    className="border-white/10 hover:bg-white/5"
                >
                    <Plus className="mr-2 h-4 w-4"/>
                    Join with Code
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/50"/>
                    <Input
                        type="search"
                        placeholder="Search clubs by name, sport, or location..."
                        className="pl-10 bg-zinc-800/50 border-white/10 focus-visible:ring-white/20 h-12 rounded-xl"
                    />
                </div>
                <div className="flex gap-2">
                    <Select>
                        <SelectTrigger className="w-40 bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                            <SelectValue placeholder="Sport"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sports</SelectItem>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="cycling">Cycling</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="soccer">Soccer</SelectItem>
                            <SelectItem value="swimming">Swimming</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-40 bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                            <SelectValue placeholder="Skill Level"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 h-12 px-4">
                        <Filter className="h-4 w-4"/>
                    </Button>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-white/60">Found {publicClubs.length} public clubs</p>
                <Select defaultValue="recent">
                    <SelectTrigger className="w-48 bg-zinc-800/50 border-white/10 text-white">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="members">Most Members</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicClubs.map((club) => (
                    <Card
                        key={club.id}
                        className="bg-zinc-900/50 border-white/10 text-white hover:border-white/20 transition-all duration-200 group"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                        {club.name.charAt(0)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{club.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline"
                                                   className="bg-white/10 text-white/80 border-0 text-xs">
                                                {club.sport}
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500"/>
                                                <span className="text-xs text-white/60">{club.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <CardDescription className="text-white/70 line-clamp-2">{club.description}</CardDescription>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-white/60">
                                    <MapPin className="h-4 w-4"/>
                                    <span>{club.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Users className="h-4 w-4"/>
                                    <span>{club.members} members</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Calendar className="h-4 w-4"/>
                                    <span>{club.meetingDays.join(", ")}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {club.tags.map((tag) => (
                                    <Badge key={tag} variant="outline"
                                           className="bg-white/5 text-white/60 border-white/10 text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt={club.owner}/>
                                    <AvatarFallback className="text-xs">
                                        {club.owner
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-xs text-white/60">
                                    <span>by {club.owner}</span>
                                    <span className="mx-1">•</span>
                                    <span>Active {club.recentActivity}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button
                                asChild
                                className="w-full group-hover:bg-white group-hover:text-black transition-all duration-200"
                            >
                                <Link href={`/dashboard/discover/${club.id}`}>
                                    View Club
                                    <ArrowRight className="ml-2 h-4 w-4"/>
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-8">
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                    Load More Clubs
                </Button>
            </div>

            {/* Join with Invite Code Dialog */}
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogContent className="bg-zinc-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Join Club with Invite Code</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Enter your club invitation code to join instantly
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="inviteCode" className="text-white/80 text-sm font-medium">
                                Invitation Code
                            </Label>
                            <Input
                                id="inviteCode"
                                type="text"
                                placeholder="Enter your invitation code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20"
                                onKeyDown={(e) => e.key === "Enter" && handleValidateCode()}
                            />
                            <p className="text-xs text-white/50">Ask your club administrator for the invitation code</p>
                        </div>

                        <Button
                            onClick={handleValidateCode}
                            disabled={!inviteCode.trim() || isValidating}
                            className="w-full bg-white text-black hover:bg-white/90"
                        >
                            {isValidating ? "Validating..." : "Find Club"}
                        </Button>

                        {/* Club Found */}
                        {clubFound && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-500"/>
                                    <div>
                                        <h4 className="font-semibold">Club Found!</h4>
                                        <p className="text-sm text-emerald-200/70">You're invited to join this club</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-3 rounded-lg mb-3">
                                    <h5 className="font-semibold mb-2">{clubFound.name}</h5>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-white/60">Sport:</span>
                                            <span>{clubFound.sport}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">Members:</span>
                                            <span>{clubFound.members}</span>
                                        </div>
                                    </div>
                                    <p className="text-white/70 text-sm mt-2">
                                        {truncate(clubFound.description, 160)}
                                    </p></div>

                                <Button onClick={handleJoinClub}
                                        className="w-full bg-emerald-500 text-white hover:bg-emerald-600">
                                    Join {clubFound.name} →
                                </Button>
                            </div>
                        )}

                        {/* Invalid Code Message */}
                        {!doesExist && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-200 text-sm">
                                    Invalid invitation code. Please check with your club administrator and try again.
                                </p>
                            </div>
                        )}

                        <div className="bg-zinc-900/30 border border-white/5 rounded-lg p-3">
                            <h4 className="text-sm font-medium mb-2">Demo Codes</h4>
                            <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-white/60">San Francisco Runners:</span>
                                    <code className="bg-white/10 px-2 py-1 rounded text-white">san-francisco</code>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={resetInviteDialog}
                                className="border-white/10 hover:bg-white/5">
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
