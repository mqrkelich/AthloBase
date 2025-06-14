"use client"

import {useState} from "react"
import {
    Users,
    Calendar,
    Settings,
    Download,
    Plus,
    Edit3,
    BarChart3,
    Trophy,
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

interface CustomStat {
    id: string;
    label: string;
    value: string;
    unit: string;
    icon: string;
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
                    )}

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

                {club.foundedDate && (
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
                )}
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
                        <ClubInfoManagement clubData={club}/>
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
