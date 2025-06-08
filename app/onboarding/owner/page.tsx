"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Crown, ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createClub } from "../_actions/create-club"
import { toast } from "sonner"


type Step = 1 | 2 | 3 | 4

type Privacy = "public" | "private" | "restricted"
// type SkillLevel = "beginner" | "intermediate" | "advanced" | "mixed"
// type AgeGroup = "youth" | "adult" | "senior" | "all-ages"

type ClubFormData = {
    name: string
    sport: string
    description: string
    location: string
    privacy: Privacy
    meetingDays: string[]
    meetingTime: string
    skillLevel: string
    ageGroup: string
}

export default function OwnerOnboardingPage() {
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [clubData, setClubData] = useState<ClubFormData>({
        name: "",
        sport: "",
        description: "",
        location: "",
        privacy: "public",
        meetingDays: [],
        meetingTime: "",
        skillLevel: "",
        ageGroup: "",
    });

    const steps = [
        { number: 1, title: "Basic Info", description: "Club name and sport" },
        { number: 2, title: "Details", description: "Description and location" },
        { number: 3, title: "Schedule", description: "Meeting times and frequency" },
        { number: 4, title: "Settings", description: "Privacy and member preferences" },
    ]

    const sports = [
        "Running",
        "Basketball",
        "Football",
        "American Football",
        "Tennis",
        "Volleyball",
        "Swimming",
        "Cycling",
        "Baseball",
        "Softball",
        "Golf",
        "Badminton",
        "Table Tennis",
        "Acrobatic Rock n Roll Dance",
        "Boxing",
        "Wrestling",
        "Karate",
        "Judo",
        "Taekwondo",
        "MMA",
        "Skateboarding",
        "Surfing",
        "Snowboarding",
        "Skiing",
        "Ice Hockey",
        "Field Hockey",
        "Lacrosse",
        "Cricket",
        "Rugby",
        "Handball",
        "Fencing",
        "Archery",
        "Rowing",
        "Canoeing",
        "Kayaking",
        "Sailing",
        "Equestrian",
        "Climbing",
        "Triathlon",
        "Duathlon",
        "Polo",
        "Diving",
        "Water Polo",
        "Bobsledding",
        "Luge",
        "Skeleton",
        "Speed Skating",
        "Figure Skating",
        "Darts",
        "Bowling",
        "Snooker",
        "Pickleball",
        "Disc Golf",
        "Ultimate Frisbee",
        "Parkour",
        "Motocross",
        "Auto Racing",
        "Other",
    ];


    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const handleDayToggle = (day: string) => {
        setClubData((prev) => ({
            ...prev,
            meetingDays: prev.meetingDays.includes(day)
                ? prev.meetingDays.filter((d) => d !== day)
                : [...prev.meetingDays, day],
        }))
    }

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep((prev) => (prev + 1) as Step)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step)
        }
    }

    const handleFinish = async () => {

        await createClub(clubData).then((res) => {
            if(res.error) {
                toast.error("Failed to create club.")
                return
            }

            if(res.success) {
                toast.success("Club created successfully.")
                window.location.href = "/dashboard"
            }
        })

    }

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return clubData.name.trim() && clubData.sport
            case 2:
                return clubData.description.trim().length >= 10 && clubData.location.trim() !== "";
            case 3:
                return clubData.meetingDays.length > 0 && clubData.meetingTime
            case 4:
                return clubData.skillLevel && clubData.ageGroup
            default:
                return false
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">

                <div className="text-center mb-8">
                    <Link
                        href="/onboarding"
                        className="inline-flex items-center text-white/60 hover:text-white/80 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to role selection
                    </Link>
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create Your Club</h2>
                    <p className="text-white/60">Let's set up your sports club step by step</p>
                </div>

                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                                        currentStep >= step.number ? "bg-emerald-500 text-white" : "bg-zinc-800 text-white/60"
                                    }`}
                                >
                                    {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                                </div>
                                <div className="text-center mt-2">
                                    <div className={`text-xs font-medium ${currentStep >= step.number ? "text-white" : "text-white/60"}`}>
                                        {step.title}
                                    </div>
                                    <div className="text-xs text-white/40 hidden sm:block">{step.description}</div>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`h-px w-8 sm:w-16 mx-2 transition-all duration-200 ${
                                        currentStep > step.number ? "bg-emerald-500" : "bg-zinc-700"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>


                <Card className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl mb-6">
                    <CardContent className="p-0">

                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Basic Information</h3>
                                    <p className="text-white/60">What's your club called and what sport do you play?</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="clubName" className="text-white/80 text-sm font-medium">
                                            Club Name *
                                        </Label>
                                        <Input
                                            id="clubName"
                                            type="text"
                                            placeholder="e.g., City Runners, Metro Basketball Club"
                                            value={clubData.name}
                                            onChange={(e) => setClubData((prev) => ({ ...prev, name: e.target.value }))}
                                            className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sport" className="text-white/80 text-sm font-medium">
                                            Sport *
                                        </Label>
                                        <Select
                                            value={clubData.sport}
                                            onValueChange={(value) => setClubData((prev) => ({ ...prev, sport: value }))}
                                        >
                                            <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                                                <SelectValue placeholder="Select your sport" />
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
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Club Details</h3>
                                    <p className="text-white/60">Tell us more about your club and where you meet</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-white/80 text-sm font-medium">
                                            Description *
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe your club, its goals, and what makes it special..."
                                            value={clubData.description}
                                            onChange={(e) => setClubData((prev) => ({ ...prev, description: e.target.value }))}
                                            className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 min-h-32 rounded-xl"
                                        />

                                        {clubData.description.trim().length > 0 && clubData.description.trim().length < 10 && (
                                            <p className="text-red-500 text-sm mt-1">
                                                Description must be at least 10 characters.
                                            </p>
                                        )}

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
                                            onChange={(e) => setClubData((prev) => ({ ...prev, location: e.target.value }))}
                                            className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Meeting Schedule</h3>
                                    <p className="text-white/60">When does your club typically meet or train?</p>
                                </div>

                                <div className="space-y-4">
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

                                    <div className="space-y-2">
                                        <Label htmlFor="meetingTime" className="text-white/80 text-sm font-medium">
                                            Typical Meeting Time *
                                        </Label>
                                        <Input
                                            id="meetingTime"
                                            type="time"
                                            value={clubData.meetingTime}
                                            onChange={(e) => setClubData((prev) => ({ ...prev, meetingTime: e.target.value }))}
                                            className="bg-zinc-800/50 border-white/10 text-white focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Club Settings</h3>
                                    <p className="text-white/60">Set up privacy and member preferences</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-white/80 text-sm font-medium">Club Privacy</Label>
                                        <Select
                                            value={clubData.privacy}
                                            onValueChange={(value) =>
                                                setClubData((prev) => ({
                                                    ...prev,
                                                    privacy: value as "public" | "private" | "restricted",
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                                                <SelectValue />
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
                                            onValueChange={(value) => setClubData((prev) => ({ ...prev, skillLevel: value }))}
                                        >
                                            <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                                                <SelectValue placeholder="Select skill level" />
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
                                            onValueChange={(value) => setClubData((prev) => ({ ...prev, ageGroup: value }))}
                                        >
                                            <SelectTrigger className="bg-zinc-800/50 border-white/10 text-white h-12 rounded-xl">
                                                <SelectValue placeholder="Select age group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="youth">Youth (Under 18)</SelectItem>
                                                <SelectItem value="adult">Adult (18-50)</SelectItem>
                                                <SelectItem value="senior">Senior (50+)</SelectItem>
                                                <SelectItem value="all-ages">All Ages Welcome</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="border-white/10 hover:bg-white/5 text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    {currentStep < 4 ? (
                        <Button onClick={handleNext} disabled={!isStepValid()} className="bg-white text-black hover:bg-white/90">
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleFinish}
                            disabled={!isStepValid()}
                            className="bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                            Create Club
                            <Check className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

            </div>
        </div>
    )
}
