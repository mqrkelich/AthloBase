"use client"

import {useState} from "react"

export interface ClubData {
    name: string
    sport: string
    description: string
    location: string
    website: string
    privacy: string
    meetingDays: string[]
    meetingTime: string
    skillLevel: string
    ageGroup: string
    maxMembers: number
    membershipFee: number
    feeType: string
    logo: string
    coverImage: string
    rules: string
    socialMedia: {
        facebook: string
        instagram: string
        twitter: string
    }
}

export function useClubCreation() {
    const [clubData, setClubData] = useState<ClubData>({
        name: "",
        sport: "",
        description: "",
        location: "",
        website: "",
        privacy: "public",
        meetingDays: [],
        meetingTime: "",
        skillLevel: "",
        ageGroup: "",
        maxMembers: 100,
        membershipFee: 0,
        feeType: "monthly",
        logo: "",
        coverImage: "",
        rules: "",
        socialMedia: {
            facebook: "",
            instagram: "",
            twitter: "",
        },
    })

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return clubData.name.trim() && clubData.sport
            case 2:
                return clubData.description.trim() && clubData.location.trim()
            case 3:
                return clubData.meetingDays.length > 0 && clubData.meetingTime
            case 4:
                return clubData.skillLevel && clubData.ageGroup
            case 5:
                return true // Optional step
            default:
                return false
        }
    }

    const handleFinish = () => {


        // Create club and redirect to dashboard
        console.log("Creating club with data:", clubData)
        //window.location.href = "/dashboard"
    }

    return {
        clubData,
        setClubData,
        isStepValid,
        handleFinish,
    }
}
