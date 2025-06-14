"use client"

import {ArrowLeft, ArrowRight, Check} from "lucide-react"
import {Button} from "@/components/ui/button"

interface CreateClubNavigationProps {
    currentStep: number
    isStepValid: boolean | string
    onPreviousAction: () => void
    onNextAction: () => void
    onFinishAction: () => void
}

export function CreateClubNavigation({
                                         currentStep,
                                         isStepValid,
                                         onPreviousAction,
                                         onNextAction,
                                         onFinishAction,
                                     }: CreateClubNavigationProps) {
    return (
        <div className="flex justify-between">
            <Button
                variant="outline"
                onClick={onPreviousAction}
                disabled={currentStep === 1}
                className="border-white/10 hover:bg-white/5 text-white"
            >
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Previous
            </Button>

            {currentStep < 5 ? (
                <Button onClick={onNextAction} disabled={!isStepValid}
                        className="bg-white text-black hover:bg-white/90">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            ) : (
                <Button onClick={onFinishAction} className="bg-emerald-500 text-white hover:bg-emerald-600">
                    Create Club
                    <Check className="ml-2 h-4 w-4"/>
                </Button>
            )}
        </div>
    )
}
