"use client"

import React, {useState} from "react"
import {Edit3, Upload, Save, X} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {sports} from "@/data/sports";
import {UploadButton} from "@/lib/uploadthing";
import {toast} from "sonner";
import {updateClubAction} from "@/app/dashboard/clubs/_actions/club";
import {useRouter} from "next/navigation"
import {AddFeatureDialog} from "./add-feature-dialog"

interface ClubData {
    id: string
    name: string
    sport: string
    description: string
    coverImage: string
    logo: string
    location: string
    website: string
    foundedDate: string | null
    pricing: {
        weekly: { name: string; price: number; features: string[] }
        monthly: { name: string; price: number; features: string[] }
        yearly: { name: string; price: number; features: string[] }
    }
}

interface ClubInfoManagementProps {
    clubData: ClubData
}

export function ClubInfoManagement({clubData}: ClubInfoManagementProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(clubData)
    const router = useRouter();

    const handleSave = async () => {

        if (!formData.name || !formData.sport || !formData.location) {
            toast.error("Please fill in all required fields.")
            return
        }

        await updateClubAction(clubData.id, formData)
            .then((msg) => {
                if (msg.error) {
                    toast.error(msg.error);
                    setIsEditing(false)
                    return;
                }

                router.refresh();
                setIsEditing(false)
                toast.success("Club information updated successfully!");
            })
    }

    const handleCancel = () => {
        setFormData(clubData)
        setIsEditing(false)
    }

    const updatePricing = (tier: "weekly" | "monthly" | "yearly", field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            pricing: {
                ...prev.pricing,
                [tier]: {
                    ...prev.pricing[tier],
                    [field]: value,
                },
            },
        }))
    }

    const [featureDialogOpen, setFeatureDialogOpen] = useState(false)
    const [selectedTier, setSelectedTier] = useState<"weekly" | "monthly" | "yearly" | null>(null)

    const handleAddFeature = (tier: "weekly" | "monthly" | "yearly") => {
        setSelectedTier(tier)
        setFeatureDialogOpen(true)
    }

    const handleFeatureSubmit = (featureData: { name: string; description: string }) => {
        if (selectedTier) {
            updatePricing(selectedTier, "features", [...formData.pricing[selectedTier].features, featureData.name])
        }
        setFeatureDialogOpen(false)
        setSelectedTier(null)
    }


    const removeFeature = (tier: "weekly" | "monthly" | "yearly", index: number) => {
        const features = formData.pricing[tier].features.filter((_, i) => i !== index)
        updatePricing(tier, "features", features)
    }

    const [logo, setLogo] = useState<string | undefined>(clubData.logo);
    const [coverImage, setCoverImage] = useState<string | undefined>(clubData.coverImage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Club Information</CardTitle>
                        <CardDescription className="text-white/60">
                            Manage your club's basic information and settings
                        </CardDescription>
                    </div>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit3 className="mr-2 h-4 w-4"/>
                            Edit Info
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCancel}
                                    className="border-white/10 hover:bg-white/5">
                                <X className="mr-2 h-4 w-4"/>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4"/>
                                Save Changes
                            </Button>
                        </div>
                    )}
                </CardHeader>
            </Card>

            {/* Basic Information */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Club Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({...prev, name: e.target.value}))}
                                disabled={!isEditing}
                                className="bg-zinc-800/50 border-white/10 disabled:opacity-60"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sport">Sport</Label>
                            <Select
                                value={formData.sport}
                                onValueChange={(value) => setFormData((prev) => ({...prev, sport: value}))}
                                disabled={!isEditing}
                            >
                                <SelectTrigger className="bg-zinc-800/50 border-white/10 disabled:opacity-60">
                                    <SelectValue/>
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
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData((prev) => ({...prev, location: e.target.value}))}
                                disabled={!isEditing}
                                className="bg-zinc-800/50 border-white/10 disabled:opacity-60"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={formData.website}
                                onChange={(e) => setFormData((prev) => ({...prev, website: e.target.value}))}
                                disabled={!isEditing}
                                className="bg-zinc-800/50 border-white/10 disabled:opacity-60"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Founded</Label>
                            <Input
                                id="founded"
                                value={formData.foundedDate || ""}
                                onChange={(e) => setFormData((prev) => ({...prev, foundedDate: e.target.value}))}
                                disabled={!isEditing}
                                className="bg-zinc-800/50 border-white/10 disabled:opacity-60"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({...prev, description: e.target.value}))}
                            disabled={!isEditing}
                            className="bg-zinc-800/50 border-white/10 disabled:opacity-60 min-h-32"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Club Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Label>Club Logo</Label>
                            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">

                                {logo ? (
                                    <img
                                        src={logo}
                                        alt="Club Logo"
                                        className="h-20 w-20 mx-auto mb-4 rounded-lg object-cover"
                                        style={{backgroundColor: "rgba(0, 0, 0, 0.1)"}}
                                    />
                                ) : (
                                    <div
                                        className="h-20 w-20 mx-auto mb-4 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                                        {clubData.name.charAt(0) || "C"}
                                    </div>
                                )}

                                {isEditing && (

                                    <Button variant="outline" size="sm"
                                            className="relative overflow-hidden border-white/10 hover:bg-white/5">
                                        <Upload className="mr-2 h-4 w-4"/>
                                        Upload Logo

                                        <UploadButton
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            endpoint="logoUploader"
                                            appearance={{
                                                button: "relative overflow-hidden border-white/10 hover:bg-white/5",
                                                container: "",
                                                allowedContent: "hidden"
                                            }}
                                            onClientUploadComplete={(res) => {

                                                toast.success("Logo uploaded successfully!");
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    logo: res[0]?.ufsUrl,
                                                }));
                                                setLogo(res[0]?.ufsUrl);

                                            }}
                                            onUploadError={() => {
                                                toast.error(`Failed to upload the logo.`);
                                            }}
                                        />
                                    </Button>

                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Label>Cover Image</Label>
                            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">

                                {coverImage ? (
                                    <img
                                        src={coverImage}
                                        alt="Cover Image"
                                        className="h-32 w-full mb-4 rounded-lg object-cover"
                                        style={{backgroundColor: "rgba(0, 0, 0, 0.1)"}}
                                    />
                                ) : (
                                    <div
                                        className="h-32 w-full mb-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                                        <span className="text-white/60">Cover Image Preview</span>
                                    </div>
                                )}

                                {isEditing && (
                                    <Button variant="outline" size="sm"
                                            className="relative overflow-hidden border-white/10 hover:bg-white/5">
                                        <Upload className="mr-2 h-4 w-4"/>
                                        Upload Cover

                                        <UploadButton
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            endpoint="coverUploader"
                                            appearance={{
                                                button: "relative overflow-hidden border-white/10 hover:bg-white/5",
                                                container: "",
                                                allowedContent: "hidden"
                                            }}
                                            onClientUploadComplete={(res) => {
                                                console.log("Files: ", res);

                                                toast.success("Cover image uploaded successfully!");
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    coverImage: res[0]?.ufsUrl,
                                                }));
                                                setCoverImage(res[0]?.ufsUrl);

                                            }}
                                            onUploadError={() => {
                                                toast.error(`Failed to upload the cover image.`);
                                            }}
                                        />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Model */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Pricing Model</CardTitle>
                    <CardDescription className="text-white/60">Set up your club's membership pricing
                        tiers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(formData.pricing).map(([tier, data]) => (
                            <Card key={tier} className="bg-white/5 border-white/10">
                                <CardHeader>
                                    <CardTitle className="capitalize">{tier} Membership</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`${tier}-name`}>Plan Name</Label>
                                        <Input
                                            id={`${tier}-name`}
                                            value={data.name}
                                            onChange={(e) => updatePricing(tier as any, "name", e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-zinc-800/50 border-white/10 disabled:opacity-60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`${tier}-price`}>Price ($)</Label>
                                        <Input
                                            id={`${tier}-price`}
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => updatePricing(tier as any, "price", Number.parseInt(e.target.value))}
                                            disabled={!isEditing}
                                            className="bg-zinc-800/50 border-white/10 disabled:opacity-60"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Features</Label>
                                        <div className="space-y-2">
                                            {data.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className="text-sm text-white/70 flex-1">• {feature}</span>
                                                    {isEditing && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-red-400"
                                                            onClick={() => removeFeature(tier as any, index)}
                                                        >
                                                            <X className="h-3 w-3"/>
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            {isEditing && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAddFeature(tier as any)}
                                                    className="border-white/10 hover:bg-white/5 w-full"
                                                >
                                                    Add Feature
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <AddFeatureDialog
                open={featureDialogOpen}
                onOpenChangeAction={setFeatureDialogOpen}
                onSubmitAction={handleFeatureSubmit}
                tierName={selectedTier ? `${selectedTier} membership` : ""}
            />

        </div>
    )
}
