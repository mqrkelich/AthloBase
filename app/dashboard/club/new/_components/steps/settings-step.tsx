"use client"

import type React from "react"

import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Switch} from "@/components/ui/switch"
import {ClubData} from "@/app/dashboard/club/new/_hooks/use-club-creation";

interface SettingsStepProps {
    clubData: ClubData
    setClubDataAction: React.Dispatch<React.SetStateAction<ClubData>>
}

export function SettingsStep({clubData, setClubDataAction}: SettingsStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Club Settings</h3>
                <p className="text-white/60">Set up privacy and member preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-white/80 text-sm font-medium">Club Privacy</Label>
                    <Select
                        value={clubData.privacy}
                        onValueChange={(value: "public" | "private" | "restricted") =>
                            setClubDataAction((prev) => ({...prev, privacy: value}))
                        }
                    >
                        <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public - Anyone can find and join</SelectItem>
                            <SelectItem value="restricted">Restricted - Approval required to join</SelectItem>
                            <SelectItem value="private">Private - Invitation only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-white/80 text-sm font-medium">Skill Level *</Label>
                    <Select
                        value={clubData.skillLevel}
                        onValueChange={(value) => setClubDataAction((prev) => ({...prev, skillLevel: value}))}
                    >
                        <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                            <SelectValue placeholder="Select skill level"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="beginner">Beginner - New to the sport</SelectItem>
                            <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                            <SelectItem value="advanced">Advanced - Experienced players</SelectItem>
                            <SelectItem value="mixed">Mixed - All skill levels welcome</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-white/80 text-sm font-medium">Age Group *</Label>
                    <Select
                        value={clubData.ageGroup}
                        onValueChange={(value) => setClubDataAction((prev) => ({...prev, ageGroup: value}))}
                    >
                        <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                            <SelectValue placeholder="Select age group"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="youth">Youth (Under 18)</SelectItem>
                            <SelectItem value="adult">Adult (18-50)</SelectItem>
                            <SelectItem value="senior">Senior (50+)</SelectItem>
                            <SelectItem value="all-ages">All Ages Welcome</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-white/80 text-sm font-medium">Auto-approve Members</Label>
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch
                            id="auto-approve"
                            checked={clubData.privacy === "public"}
                            onCheckedChange={(checked) =>
                                setClubDataAction((prev) => ({...prev, privacy: checked ? "public" : "restricted"}))
                            }
                        />
                        <Label htmlFor="auto-approve" className="text-sm text-white/70">
                            Automatically approve new member requests
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    )
}
