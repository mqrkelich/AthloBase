"use client"

import {ArrowLeft, ArrowRight, Check} from "lucide-react"
import {Button} from "@/components/ui/button"

interface CreateClubNavigationProps {
    currentStep: number
    isStepValid: boolean | string
    onPrevious: () => void
    onNext: () => void
    onFinish: () => void
}

export function CreateClubNavigation({
                                         currentStep,
                                         isStepValid,
                                         onPrevious,
                                         onNext,
                                         onFinish,
                                     }: CreateClubNavigationProps) {
    return (
        <div className="flex justify-between">
            <Button
                variant="outline"
                onClick={onPrevious}
                disabled={currentStep === 1}
                className="border-white/10 hover:bg-white/5 text-white"
            >
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Previous
            </Button>

            {currentStep < 5 ? (
                <Button onClick={onNext} disabled={!isStepValid} className="bg-white text-black hover:bg-white/90">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            ) : (
                <Button onClick={onFinish} className="bg-emerald-500 text-white hover:bg-emerald-600">
                    Create Club
                    <Check className="ml-2 h-4 w-4"/>
                </Button>
            )}
        </div>
    )
}
