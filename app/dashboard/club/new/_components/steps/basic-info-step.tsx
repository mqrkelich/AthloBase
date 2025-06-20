"use client"

import type React from "react"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ClubData} from "@/app/dashboard/club/new/_hooks/use-club-creation";
import {sports} from "@/data/sports";

interface BasicInfoStepProps {
    clubData: ClubData
    setClubDataAction: React.Dispatch<React.SetStateAction<ClubData>>
}

export function BasicInfoStep({clubData, setClubDataAction}: BasicInfoStepProps) {


    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Basic Information</h3>
                <p className="text-white/60">What's your club called and what sport do you play?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="clubName" className="text-white/80 text-sm font-medium">
                        Club Name *
                    </Label>
                    <Input
                        id="clubName"
                        type="text"
                        placeholder="e.g., City Runners, Metro Basketball Club"
                        value={clubData.name}
                        onChange={(e) => setClubDataAction((prev) => ({...prev, name: e.target.value}))}
                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sport" className="text-white/80 text-sm font-medium">
                        Sport *
                    </Label>
                    <Select value={clubData.sport}
                            onValueChange={(value) => setClubDataAction((prev) => ({...prev, sport: value}))}>
                        <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                            <SelectValue placeholder="Select your sport"/>
                        </SelectTrigger>
                        <SelectContent>
                            {sports.map((sport) => (
                                <SelectItem key={sport} value={sport}>
                                    {sport}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location" className="text-white/80 text-sm font-medium">
                        Primary Location *
                    </Label>
                    <Input
                        id="location"
                        type="text"
                        placeholder="e.g., Central Park, Downtown Sports Center"
                        value={clubData.location}
                        onChange={(e) => setClubDataAction((prev) => ({...prev, location: e.target.value}))}
                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website" className="text-white/80 text-sm font-medium">
                        Website (Optional)
                    </Label>
                    <Input
                        id="website"
                        type="url"
                        placeholder="https://yourclub.com"
                        value={clubData.website}
                        onChange={(e) => setClubDataAction((prev) => ({...prev, website: e.target.value}))}
                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                    />
                </div>
            </div>
        </div>
    )
}
