"use client"

import type React from "react"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ClubData} from "@/app/dashboard/club/new/_hooks/use-club-creation";

interface ScheduleStepProps {
    clubData: ClubData
    setClubData: React.Dispatch<React.SetStateAction<ClubData>>
}

export function ScheduleStep({clubData, setClubData}: ScheduleStepProps) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const handleDayToggle = (day: string) => {
        setClubData((prev) => ({
            ...prev,
            meetingDays: prev.meetingDays.includes(day)
                ? prev.meetingDays.filter((d) => d !== day)
                : [...prev.meetingDays, day],
        }))
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Meeting Schedule</h3>
                <p className="text-white/60">When does your club typically meet or train?</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-white/80 text-sm font-medium">Meeting Days *</Label>
                    <div className="flex flex-wrap gap-2">
                        {days.map((day) => (
                            <Badge
                                key={day}
                                variant={clubData.meetingDays.includes(day) ? "default" : "outline"}
                                className={`cursor-pointer transition-all duration-200 ${
                                    clubData.meetingDays.includes(day)
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                        : "bg-zinc-800/50 text-white/70 border-white/20 hover:bg-zinc-800"
                                }`}
                                onClick={() => handleDayToggle(day)}
                            >
                                {day.slice(0, 3)}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="meetingTime" className="text-white/80 text-sm font-medium">
                            Typical Meeting Time *
                        </Label>
                        <Input
                            id="meetingTime"
                            type="time"
                            value={clubData.meetingTime}
                            onChange={(e) => setClubData((prev) => ({...prev, meetingTime: e.target.value}))}
                            className="bg-zinc-800/50 border-white/10 text-white focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80 text-sm font-medium">Session Duration</Label>
                        <Select>
                            <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                                <SelectValue placeholder="Select duration"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="90">1.5 hours</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                                <SelectItem value="180">3 hours</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}
