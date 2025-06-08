"use client"

import {useState} from "react"
import Link from "next/link"
import {ArrowLeft} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import {CreateClubProgress} from "@/app/dashboard/club/new/_components/create-club-progress";
import {BasicInfoStep} from "@/app/dashboard/club/new/_components/steps/basic-info-step";
import {DetailsStep} from "@/app/dashboard/club/new/_components/steps/details-step";
import {ScheduleStep} from "@/app/dashboard/club/new/_components/steps/schedule-step";
import {SettingsStep} from "@/app/dashboard/club/new/_components/steps/settings-step";
import {BrandingStep} from "@/app/dashboard/club/new/_components/steps/branding-step";
import {CreateClubHeader} from "@/app/dashboard/club/new/_components/create-club-header";
import {CreateClubNavigation} from "@/app/dashboard/club/new/_components/create-club-navigation";
import {useClubCreation} from "@/app/dashboard/club/new/_hooks/use-club-creation";

type Step = 1 | 2 | 3 | 4 | 5

export default function CreateClubPage() {
    const [currentStep, setCurrentStep] = useState<Step>(5)
    const {clubData, setClubData, isStepValid, handleFinish} = useClubCreation()

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep((prev) => (prev + 1) as Step)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step)
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <BasicInfoStep clubData={clubData} setClubData={setClubData}/>
            case 2:
                return <DetailsStep clubData={clubData} setClubData={setClubData}/>
            case 3:
                return <ScheduleStep clubData={clubData} setClubData={setClubData}/>
            case 4:
                return <SettingsStep clubData={clubData} setClubData={setClubData}/>
            case 5:
                return <BrandingStep clubData={clubData} setClubData={setClubData}/>
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto">

                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-white/60 hover:text-white/80 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        Back to Dashboard
                    </Link>
                    <CreateClubHeader/>
                </div>

                <CreateClubProgress currentStep={currentStep}/>

                <Card
                    className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl mb-6">
                    <CardContent className="p-0">{renderCurrentStep()}</CardContent>
                </Card>


                <CreateClubNavigation
                    currentStep={currentStep}
                    isStepValid={isStepValid(currentStep)}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onFinish={handleFinish}
                />

            </div>
        </div>
    )
}
