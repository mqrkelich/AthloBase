"use client"

import type React from "react"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ClubData} from "@/app/dashboard/club/new/_hooks/use-club-creation";

interface DetailsStepProps {
    clubData: ClubData
    setClubData: React.Dispatch<React.SetStateAction<ClubData>>
}

export function DetailsStep({clubData, setClubData}: DetailsStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Club Details</h3>
                <p className="text-white/60">Tell us more about your club and its purpose</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white/80 text-sm font-medium">
                        Club Description *
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your club, its goals, and what makes it special..."
                        value={clubData.description}
                        onChange={(e) => setClubData((prev) => ({...prev, description: e.target.value}))}
                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 min-h-32 rounded-xl"
                    />

                    {clubData.description.trim().length > 0 && clubData.description.trim().length < 10 && (
                        <p className="text-red-500 text-sm mt-1">
                            Description must be at least 10 characters.
                        </p>
                    )}

                </div>

                <div className="space-y-2">
                    <Label htmlFor="rules" className="text-white/80 text-sm font-medium">
                        Club Rules & Guidelines (Optional)
                    </Label>
                    <Textarea
                        id="rules"
                        placeholder="List any important rules, expectations, or guidelines for members..."
                        value={clubData.rules}
                        onChange={(e) => setClubData((prev) => ({...prev, rules: e.target.value}))}
                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 min-h-24 rounded-xl"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="maxMembers" className="text-white/80 text-sm font-medium">
                            Maximum Members
                        </Label>
                        <Input
                            id="maxMembers"
                            type="number"
                            min="1"
                            value={clubData.maxMembers}
                            onChange={(e) => setClubData((prev) => ({
                                ...prev,
                                maxMembers: Number.parseInt(e.target.value)
                            }))}
                            className="bg-zinc-800/50 border-white/10 text-white focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/80 text-sm font-medium">Membership Fee</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={clubData.membershipFee}
                                onChange={(e) => setClubData((prev) => ({
                                    ...prev,
                                    membershipFee: Number.parseFloat(e.target.value)
                                }))}
                                className="bg-zinc-800/50 border-white/10 text-white focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                            />
                            <Select
                                value={clubData.feeType}
                                onValueChange={(value: "public" | "private" | "restricted") =>
                                    setClubData((prev) => ({...prev, privacy: value}))
                                }
                            >
                                <SelectTrigger
                                    className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl w-32">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                    <SelectItem value="one-time">One-time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
