"use client"

import {useState} from "react"
import {createClubDashboard} from "@/app/dashboard/club/new/_actions/create-club";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export interface ClubData {
    name: string
    sport: string
    description: string
    location: string
    website: string
    privacy: "public" | "private" | "restricted"
    meetingDays: string[]
    meetingTime: string
    skillLevel: string
    ageGroup: string
    maxMembers: number
    membershipFee: number
    feeType: "weekly" | "monthly" | "yearly"
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

    const router = useRouter()

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

    const handleFinish = async () => {
        const transformed = {
            ...clubData,
            pricing: {
                interval: clubData.feeType as "weekly" | "monthly" | "yearly",
                name: "Standard Membership",
                price: clubData.membershipFee,
            },
        };

        await createClubDashboard(transformed).then((result) => {
            if (result.error) {
                toast.error("Failed to create club. Please try again.");
            } else {
                toast.success("Club created successfully!");
                router.replace("/dashboard");
            }
        })
    };

    return {
        clubData,
        setClubData,
        isStepValid,
        handleFinish,
    }
}
