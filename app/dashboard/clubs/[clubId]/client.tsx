"use client"

import {useState} from "react"
import {notFound, useParams} from "next/navigation"
import {
    Users,
    Calendar,
    Settings,
    Download,
    Plus,
    Edit3,
    BarChart3,
    Trophy,
    Target,
    Activity,
    LucideIcon
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {ClubOverviewPanel} from "@/app/dashboard/_components/club-managment/club-overview-panel";
import {MemberManagement} from "@/app/dashboard/_components/club-managment/member-management";
import {EventManagement} from "@/app/dashboard/_components/club-managment/event-management";
import {ClubInfoManagement} from "@/app/dashboard/_components/club-managment/club-info-management";
import {CustomFieldManagement} from "@/app/dashboard/_components/club-managment/custom-field-management";
import {ExportReporting} from "@/app/dashboard/_components/club-managment/export-reporting";

// Mock club data - in real app this would come from API
const clubData = {
    id: "city-runners",
    name: "City Runners",
    sport: "Running",
    description: "A community of passionate runners training together in the city",
    coverImage: "/placeholder.svg?height=200&width=800",
    logo: "/placeholder.svg?height=80&width=80",
    memberCount: 124,
    activeEvents: 8,
    totalEvents: 247,
    foundedDate: "2019-03-15",
    location: "Central Park, NYC",
    website: "https://cityrunners.com",
    customStats: [
        {id: 1, label: "Total Runs", value: "1,247", unit: "runs", icon: Activity},
        {id: 2, label: "Total Distance", value: "15,678", unit: "miles", icon: Target},
        {id: 3, label: "Avg Attendance", value: "87", unit: "%", icon: Users},
        {id: 4, label: "Longest Streak", value: "156", unit: "days", icon: Trophy},
        {id: 5, label: "Active Members", value: "124", unit: "members", icon: Users},
    ],
    pricing: {
        weekly: {name: "Weekly Pass", price: 15, features: ["Access to all sessions", "Basic support"]},
        monthly: {name: "Monthly Membership", price: 50, features: ["Unlimited access", "Priority support", "Events"]},
        yearly: {
            name: "Annual Membership",
            price: 500,
            features: ["All benefits", "Premium support", "Exclusive events", "Merchandise"],
        },
    },
}

interface CustomStat {
    id: number;
    label: string;
    value: string;
    unit: string;
    icon: LucideIcon;
}

interface PricingOption {
    name: string;
    price: number;
    features: string[];
}

interface Pricing {
    weekly: PricingOption;
    monthly: PricingOption;
    yearly: PricingOption;
}

export interface Club {
    id: string;
    name: string;
    sport: string;
    description: string;
    coverImage: string;
    logo: string;
    memberCount: number;
    activeEvents: number;
    totalEvents: number;
    foundedDate: string | null;
    location: string;
    website: string;
    customStats: CustomStat[];
    pricing: Pricing;
}

interface ClubManagementClientProps {
    club: Club;
    clubId: string;
}

export default function ClubManagementClient({club, clubId}: ClubManagementClientProps) {


    const params = useParams()
    const [activeTab, setActiveTab] = useState("overview")


    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                    )
                    }

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{club.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-500 border-0">
                                {club.sport}
                            </Badge>
                            <span className="text-white/60 text-sm">{club.memberCount} members</span>
                            <span className="text-white/60 text-sm">•</span>
                            <span className="text-white/60 text-sm">{club.activeEvents} active events</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        <Download className="mr-2 h-4 w-4"/>
                        Export Data
                    </Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4"/>
                        Add Member
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Total Members</p>
                                <p className="text-2xl font-bold">{club.memberCount}</p>
                            </div>
                            <Users className="h-8 w-8 text-emerald-500"/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Active Events</p>
                                <p className="text-2xl font-bold">{club.activeEvents}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-500"/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Total Events</p>
                                <p className="text-2xl font-bold">{club.totalEvents}</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-orange-500"/>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/60 text-sm">Founded</p>
                                <p className="text-2xl font-bold">{club.foundedDate}</p>
                            </div>
                            <Trophy className="h-8 w-8 text-purple-500"/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-zinc-800/50 text-white/60 w-full justify-start overflow-x-auto">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4"/>
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="members" className="flex items-center gap-2">
                        <Users className="h-4 w-4"/>
                        Members
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4"/>
                        Events
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4"/>
                        Club Settings
                    </TabsTrigger>
                    <TabsTrigger value="fields" className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4"/>
                        Custom Fields
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center gap-2">
                        <Download className="h-4 w-4"/>
                        Reports
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="overview" className="space-y-6">
                        <ClubOverviewPanel clubData={club}/>
                    </TabsContent>

                    <TabsContent value="members" className="space-y-6">
                        <MemberManagement clubId={clubId}/>
                    </TabsContent>

                    <TabsContent value="events" className="space-y-6">
                        <EventManagement clubId={clubId}/>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                        <ClubInfoManagement clubData={clubData}/>
                    </TabsContent>

                    <TabsContent value="fields" className="space-y-6">
                        <CustomFieldManagement clubId={clubId}/>
                    </TabsContent>

                    <TabsContent value="reports" className="space-y-6">
                        <ExportReporting clubId={clubId}/>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
