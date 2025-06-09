"use client"

import Link from "next/link"
import {Search, MapPin, Users, Calendar, ArrowRight, Filter, Plus, CheckCircle} from "lucide-react"
import {useEffect, useState} from "react"

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
import {getPublicClubs} from "@/app/dashboard/discover/_actions/get-public-clubs";
import {getUserInitials} from "@/lib/helper/get-initials";
import {sports} from "@/data/sports";
import {useDebounce} from "@/hooks/use-debounce";

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

    const [clubs, setClubs] = useState<any[]>([])
    const [totalClubs, setTotalClubs] = useState(0)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const [doesExist, setDoesExist] = useState(true)
    const [loading, setLoading] = useState(false)

    const [sport, setSport] = useState<string | undefined>('all')
    const [skill, setSkill] = useState<string | undefined>('all')
    const [sort, setSort] = useState<"recent" | "members">("recent")
    const [search, setSearch] = useState("")


    const debouncedSearch = useDebounce(search, 300)

    useEffect(() => {
        loadClubs(1, true)
    }, [sport, skill, sort, debouncedSearch])


    const loadClubs = async (pageToLoad: number, reset = false) => {
        if (loading) return
        setLoading(true)


        const result = await getPublicClubs({
            page: pageToLoad,
            per_page: 1,
            sport,
            skill,
            sort,
            search,
        })

        setClubs((prev) => (reset ? result.clubs : [...prev, ...result.clubs]))
        setTotalClubs(result.total || 0)
        setPage(result.nextPage ?? pageToLoad + 1)
        setHasMore(result.hasMore)
        setLoading(false)
    }

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
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search clubs by name, sport, or location..."
                        className="pl-10 bg-zinc-800/50 border-white/10 focus-visible:ring-white/20 h-12 rounded-xl"
                    />
                </div>
                <div className="flex gap-2">
                    <Select onValueChange={(val) => setSport(val === "all" ? undefined : val)}>
                        <SelectTrigger className="w-40 bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                            <SelectValue placeholder="Sport"/>
                        </SelectTrigger>
                        <SelectContent>
                            {sports.map((sport) => (
                                <SelectItem key={sport} value={sport}>
                                    {sport}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(val) => setSkill(val === "all" ? undefined : val)}>
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
                    <Button onClick={() => {
                        setSport('all');
                        setSkill('all');
                        setSearch('');
                        setSort('recent');
                    }} variant="outline" className="border-white/10 hover:bg-white/5 h-12 px-4">
                        <Filter className="h-4 w-4"/>
                    </Button>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-white/60">Found {totalClubs} public clubs in total across the platform</p>
                <Select value={sort} onValueChange={(val) => setSort(val as any)} defaultValue="recent">
                    <SelectTrigger className="w-48 bg-zinc-800/50 border-white/10 text-white">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="members">Most Members</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club) => (
                    <Card
                        key={club.id}
                        className="bg-zinc-900/50 border-white/10 text-white hover:border-white/20 transition-all duration-200 group"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">

                                    {club.logo ? (
                                        <div>
                                            <img
                                                src={club.logo}
                                                alt={`${club.name} logo`}
                                                className="h-16 w-16 rounded object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                            {club.name.charAt(0)}
                                        </div>
                                    )}

                                    <div>
                                        <CardTitle className="text-lg">{club.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline"
                                                   className="bg-white/10 text-white/80 border-0 text-xs">
                                                {club.sport}
                                            </Badge>
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

                            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={club.ownerImage} alt={club.owner}/>
                                    <AvatarFallback className="text-xs">
                                        {getUserInitials(club.owner)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-xs text-white/60">
                                    <span>by {club.owner}</span>
                                    <span className="mx-1">•</span>
                                    <span>Created {club.created}</span>
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

            {hasMore && (
                <div className="text-center pt-8">
                    <Button
                        variant="outline"
                        className="border-white/10 hover:bg-white/5"
                        disabled={loading}
                        onClick={() => loadClubs(page)}
                    >
                        {loading ? "Loading..." : "Load More Clubs"}
                    </Button>
                </div>
            )}

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
