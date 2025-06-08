import {Check} from "lucide-react"

interface CreateClubProgressProps {
    currentStep: number
}

export function CreateClubProgress({currentStep}: CreateClubProgressProps) {
    const steps = [
        {number: 1, title: "Basic Info", description: "Club name and sport"},
        {number: 2, title: "Details", description: "Description and location"},
        {number: 3, title: "Schedule", description: "Meeting times and frequency"},
        {number: 4, title: "Settings", description: "Privacy and member preferences"},
        {number: 5, title: "Branding", description: "Images and social media"},
    ]

    return (
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center min-w-0">
                    <div className="flex flex-col items-center">
                        <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                                currentStep >= step.number ? "bg-emerald-500 text-white" : "bg-zinc-800 text-white/60"
                            }`}
                        >
                            {currentStep > step.number ? <Check className="h-5 w-5"/> : step.number}
                        </div>
                        <div className="text-center mt-2">
                            <div
                                className={`text-xs font-medium ${currentStep >= step.number ? "text-white" : "text-white/60"}`}>
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
    )
}
