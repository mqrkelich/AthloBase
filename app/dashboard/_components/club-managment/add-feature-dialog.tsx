"use client"

import type React from "react"

import {useState} from "react"
import {Plus, X} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

interface AddFeatureDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onSubmitAction: (featureData: { name: string; description: string }) => void
    tierName: string
}

export function AddFeatureDialog({open, onOpenChangeAction, onSubmitAction, tierName}: AddFeatureDialogProps) {
    const [featureName, setFeatureName] = useState("")
    const [featureDescription, setFeatureDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({})

    const validateForm = () => {
        const newErrors: { name?: string; description?: string } = {}

        if (!featureName.trim()) {
            newErrors.name = "Feature name is required"
        } else if (featureName.trim().length < 3) {
            newErrors.name = "Feature name must be at least 3 characters"
        } else if (featureName.trim().length > 50) {
            newErrors.name = "Feature name must be less than 50 characters"
        }

        if (featureDescription.length > 200) {
            newErrors.description = "Description must be less than 200 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        onSubmitAction({
            name: featureName.trim(),
            description: featureDescription.trim(),
        })

        // Reset form
        setFeatureName("")
        setFeatureDescription("")
        setErrors({})
        setIsSubmitting(false)
    }

    const handleCancel = () => {
        setFeatureName("")
        setFeatureDescription("")
        setErrors({})
        onOpenChangeAction(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-emerald-500"/>
                        Add Feature
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Add a new feature to your {tierName}. This will help members understand what's included.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="feature-name">Feature Name *</Label>
                        <Input
                            id="feature-name"
                            value={featureName}
                            onChange={(e) => {
                                setFeatureName(e.target.value)
                                if (errors.name) {
                                    setErrors((prev) => ({...prev, name: undefined}))
                                }
                            }}
                            placeholder="e.g., Access to premium equipment"
                            className="bg-zinc-800/50 border-white/10 focus:border-emerald-500"
                            maxLength={50}
                        />
                        {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                        <p className="text-xs text-white/40">{featureName.length}/50 characters</p>
                    </div>

                    <DialogFooter className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="border-white/10 hover:bg-white/5"
                            disabled={isSubmitting}
                        >
                            <X className="mr-2 h-4 w-4"/>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !featureName.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <div
                                        className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"/>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Add Feature
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
