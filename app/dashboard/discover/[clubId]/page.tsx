import Link from "next/link"
import {
    ArrowLeft,
    MapPin,
    Users,
    Calendar,
    Clock,
    Shield,
    Trophy,
    Share2,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Separator} from "@/components/ui/separator"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {getClubById} from "@/app/dashboard/_actions/get-club";
import {formatDate} from "@/lib/utils"
import {getEventsByClub} from "@/app/dashboard/clubs/_actions/events";
import {getCurrentUser} from "@/lib/helper/session";
import {getUserById} from "@/data/user";

export default async function ClubDetailPage({params}: { params: { clubId: string } }) {
    const club = await getClubById(params.clubId);

    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!club || club.privacy !== "Public") {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white">Club Not Found</h1>
                <p className="text-white/70 mt-2">The club you are looking for does not exist or has been removed.</p>
            </div>
        )
    }

    const events = await getEventsByClub(club.id)

    type Interval = "weekly" | "monthly" | "yearly";

    const hasPricingPlanName = (["weekly", "monthly", "yearly"] as Interval[]).some(
        (interval: Interval) => club.pricing?.[interval]?.name?.trim()
    );

    let isMember = false;

    if (user) {
        isMember = club.members.some(member => member?.id === user.id);
    }

    return (
        <div className="p-6 space-y-8">

            <Link
                href="/dashboard/discover"
                className="inline-flex items-center text-white/60 hover:text-white/80 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2"/>
                Back to Discover Clubs
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-zinc-900/50 border-white/10 text-white">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">

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
                                            className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                                            {club.name.charAt(0)}
                                        </div>
                                    )}

                                    <div>
                                        <CardTitle className="text-2xl">{club.name}</CardTitle>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge variant="outline"
                                                   className="bg-emerald-500/20 text-emerald-500 border-0">
                                                {club.sport}
                                            </Badge>
                                            <Badge variant="outline" className="bg-white/10 text-white/80 border-0">
                                                {club.privacy}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5">
                                        <Share2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white/80">
                                        <MapPin className="h-5 w-5 text-white/60"/>
                                        <span>{club.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/80">
                                        <Users className="h-5 w-5 text-white/60"/>
                                        <span>{club.memberCount} members</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/80">
                                        <Calendar className="h-5 w-5 text-white/60"/>
                                        <span>{club.meetingDays.join(", ")}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-white/80">
                                        <Clock className="h-5 w-5 text-white/60"/>
                                        <span>{club.meetingTime}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/80">
                                        <Shield className="h-5 w-5 text-white/60"/>
                                        <span>Skill Level: {club.skillLevel}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/80">
                                        <Trophy className="h-5 w-5 text-white/60"/>
                                        <span>Age Group: {club.ageGroup}</span>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Detailed Content */}
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className="bg-zinc-800/50 text-white/60">
                            <TabsTrigger value="about">About</TabsTrigger>
                            {events && events.length > 0 && (
                                <TabsTrigger value="events">Events</TabsTrigger>
                            )}
                            <TabsTrigger value="members">Members</TabsTrigger>
                            {hasPricingPlanName && (
                                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="about" className="mt-6">
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle>About {club.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="prose prose-invert max-w-none">
                                        {club.description.split("\n\n").map((paragraph, index) => (
                                            <p key={index} className="text-white/70 leading-relaxed mb-4">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>

                                    <Separator className="bg-white/10"/>

                                    {club.customStats.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Club Statistics</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {club.customStats.map((stat) => (
                                                    <div key={stat.id}
                                                         className="bg-white/5 p-4 rounded-lg text-center">
                                                        <div
                                                            className="text-2xl font-bold text-emerald-500">{stat.value}
                                                            <span
                                                                className="text-sm text-white/40 font-normal"> {stat.unit}</span>
                                                        </div>
                                                        <div className="text-sm text-white/60">{stat.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </CardContent>
                            </Card>
                        </TabsContent>


                        <TabsContent value="events" className="mt-6">
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle>Upcoming Events</CardTitle>
                                    <CardDescription className="text-white/60">Join us for these upcoming activities</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {events.map((event) => (
                                            <div key={event.id} className="bg-white/5 p-4 rounded-lg">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{event.title}</h4>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>{event.date}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{event.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                <span>{event.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-white/60">{event.attendees} attending</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>


                        <TabsContent value="members" className="mt-6">
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle>Recent Members</CardTitle>
                                    <CardDescription className="text-white/60">New members who recently
                                        joined</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {club.members.map((member, index) => (

                                            <div key={index} className="flex items-center justify-between">
                                                {member && (
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={member.image || "/placeholder.svg"}
                                                                         alt={member.name}/>
                                                            <AvatarFallback>
                                                                {member.name
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{member.name}</p>
                                                            <p className="text-sm text-white/60">Joined {formatDate(member.joined)}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="pricing" className="mt-6">
                            <Card className="bg-zinc-900/50 border-white/10 text-white">
                                <CardHeader>
                                    <CardTitle>Pricing Plans</CardTitle>
                                    <CardDescription className="text-white/60">
                                        Choose a plan that fits your needs
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {(["weekly", "monthly", "yearly"] as const).map((interval) => {
                                            const plan = club.pricing[interval];

                                            if (!plan || !plan.name) return null;

                                            return (
                                                <div key={interval}
                                                     className="bg-white/5 rounded-lg p-6 flex flex-col h-full">
                                                    <div
                                                        className="mb-2 text-lg font-semibold capitalize">{plan.name || interval}</div>
                                                    <div className="text-3xl font-bold text-emerald-400 mb-4">
                                                        ${plan.price}
                                                        <span
                                                            className="text-base text-white/60 font-normal"> /{interval}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <ul className="space-y-2 text-white/80 text-sm">
                                                            {plan.features.length > 0 ? (
                                                                plan.features.map((feature, idx) => (
                                                                    <li key={idx} className="flex items-center gap-2">
                                                                        <span
                                                                            className="h-2 w-2 rounded-full bg-emerald-400 inline-block"/>
                                                                        {feature}
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="text-white/40">No features listed</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Join Club Card */}
                    <Card className="bg-zinc-900/50 border-white/10 text-white">
                        <CardHeader>
                            <CardTitle>Join This Club</CardTitle>
                            <CardDescription className="text-white/60">
                                {isMember ? "You are a member of this club. You can leave at any time." : "Become a member and start participating in activities."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isMember ? (
                                <Button variant="destructive" className="w-full mt-2">
                                    Leave Club
                                </Button>
                            ) : (
                                <Button variant="default" className="w-full mt-2">
                                    Join Club
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Club Owner */}
                    {club.owner && (
                        <Card className="bg-zinc-900/50 border-white/10 text-white">
                            <CardHeader>
                                <CardTitle>Club Owner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={club.owner.image || "/placeholder.svg"}
                                                     alt={club.owner.name}/>
                                        <AvatarFallback>
                                            {club.owner.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{club.owner.name}</p>
                                        <p className="text-sm text-white/60">Member
                                            since {formatDate(club.owner.createdAt)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <Card className="bg-zinc-900/50 border-white/10 text-white">
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-white/60">Members</span>
                                <span className="font-medium">{club.memberCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Privacy</span>
                                <span className="font-medium">{club.privacy}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Founded</span>
                                <span className="font-medium">{club.foundedDate || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Total Events</span>
                                <span className="font-medium">{club.totalEvents}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
