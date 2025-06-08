"use client"

import type React from "react"

import {Upload} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {ClubData} from "@/hooks/use-club-creation";

interface BrandingStepProps {
    clubData: ClubData
    setClubData: React.Dispatch<React.SetStateAction<ClubData>>
}

export function BrandingStep({clubData, setClubData}: BrandingStepProps) {
    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Club Branding</h3>
                <p className="text-white/60">Add images and social media links (optional)</p>
            </div>

            <div className="space-y-6">
                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Label>Club Logo</Label>
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                            <div
                                className="h-20 w-20 mx-auto mb-4 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                                {clubData.name.charAt(0) || "C"}
                            </div>
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                                <Upload className="mr-2 h-4 w-4"/>
                                Upload Logo
                            </Button>
                            <p className="text-xs text-white/50 mt-2">PNG, JPG up to 2MB</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Cover Image</Label>
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                            <div
                                className="h-32 w-full mb-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                                <span className="text-white/60">Cover Image Preview</span>
                            </div>
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                                <Upload className="mr-2 h-4 w-4"/>
                                Upload Cover
                            </Button>
                            <p className="text-xs text-white/50 mt-2">PNG, JPG up to 5MB</p>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                    <Label className="text-white/80 text-sm font-medium">Social Media Links (Optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="facebook" className="text-sm text-white/60">
                                Facebook
                            </Label>
                            <Input
                                id="facebook"
                                type="url"
                                placeholder="https://facebook.com/yourclub"
                                value={clubData.socialMedia.facebook}
                                onChange={(e) =>
                                    setClubData((prev) => ({
                                        ...prev,
                                        socialMedia: {...prev.socialMedia, facebook: e.target.value},
                                    }))
                                }
                                className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram" className="text-sm text-white/60">
                                Instagram
                            </Label>
                            <Input
                                id="instagram"
                                type="url"
                                placeholder="https://instagram.com/yourclub"
                                value={clubData.socialMedia.instagram}
                                onChange={(e) =>
                                    setClubData((prev) => ({
                                        ...prev,
                                        socialMedia: {...prev.socialMedia, instagram: e.target.value},
                                    }))
                                }
                                className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter" className="text-sm text-white/60">
                                Twitter
                            </Label>
                            <Input
                                id="twitter"
                                type="url"
                                placeholder="https://twitter.com/yourclub"
                                value={clubData.socialMedia.twitter}
                                onChange={(e) =>
                                    setClubData((prev) => ({
                                        ...prev,
                                        socialMedia: {...prev.socialMedia, twitter: e.target.value},
                                    }))
                                }
                                className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
