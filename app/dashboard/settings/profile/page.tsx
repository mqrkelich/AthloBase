"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { User, Shield, Bell, Download, Trash2, Save, Loader2, Upload } from "lucide-react"
import { UploadButton } from "@/lib/uploadthing"
import {
  updateUserProfile,
  deleteUserAccount,
  exportUserData,
  getUserProfile,
  updateUserAvatar,
} from "../_actions/profile-settings"

interface UserProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  createdAt: Date
}

export default function ProfileSettingsPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  useEffect(() => {
    async function loadProfile() {
      try {
        if (session?.user?.id) {
          const data = await getUserProfile(session.user.id)
          setProfile(data)
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [session])

  const handleSavePersonal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!session?.user?.id) {
      toast.error("User ID is missing. Cannot update profile.")
      return
    }

    setSaving(true)

    try {
      const formData = new FormData(event.currentTarget)
      console.log("Form data being sent:", {
        name: formData.get("name"),
        email: formData.get("email"),
      })

      const updatedProfile = await updateUserProfile(session.user.id, formData)
      setProfile(updatedProfile)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUploadComplete = async (res: any) => {
    try {
      setUploadingAvatar(false)
      console.log("Upload response:", res)

      if (res && res[0] && res[0].url) {
        const imageUrl = res[0].url
        const userId = session?.user?.id
        if (!userId) {
          toast.error("User ID is missing. Cannot update avatar.")
          return
        }
        const updatedProfile = await updateUserAvatar(userId, imageUrl)
        setProfile(updatedProfile)
        toast.success("Avatar updated successfully!")
      }
    } catch (error) {
      console.error("Failed to update avatar:", error)
      toast.error("Failed to update avatar")
    }
  }

  const handleAvatarUploadError = (error: Error) => {
    setUploadingAvatar(false)
    console.error("Avatar upload error:", error)
    toast.error("Failed to upload avatar")
  }

  const handleExportData = async () => {
    if (!session?.user?.id) {
      toast.error("User ID is missing. Cannot export data.")
      return
    }
    try {
      console.log("Starting data export...")
      const data = await exportUserData(session.user.id)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `profile-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Data exported successfully!")
    } catch (error) {
      console.error("Failed to export data:", error)
      toast.error("Failed to export data")
    }
  }

  const handleDeleteAccount = async () => {
    const userId = session?.user?.id
    if (!userId) {
      toast.error("User ID is missing. Cannot delete account.")
      return
    }
    try {
      await deleteUserAccount(userId)
      toast.success("Account deleted successfully")
      // Redirect to home page or sign out
    } catch (error) {
      console.error("Failed to delete account:", error)
      toast.error("Failed to delete account")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="h-64 bg-white/10 rounded"></div>
            <div className="h-32 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-white/60">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-white/60">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
            <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Personal
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-white/60">
                  Update your personal details and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.image || "/placeholder.svg"} alt={profile.name || "User"} />
                      <AvatarFallback className="bg-white/10 text-white text-lg">
                        {profile.name ? getInitials(profile.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-2">Profile Picture</h3>
                    <p className="text-white/60 text-sm mb-4">Upload a new avatar for your profile</p>
                    <div className="flex items-center gap-4">
                      <UploadButton
                        endpoint="avatarUploader"
                        onClientUploadComplete={handleAvatarUploadComplete}
                        onUploadError={handleAvatarUploadError}
                        onUploadBegin={() => setUploadingAvatar(true)}
                        appearance={{
                          button: `
                            bg-gradient-to-r from-zinc-800 to-zinc-700 
                            hover:from-zinc-700 hover:to-zinc-600 
                            text-white border border-white/20 
                            text-sm px-6 py-3 rounded-lg font-medium 
                            transition-all duration-200 
                            shadow-lg hover:shadow-xl
                            backdrop-blur-sm
                            ${uploadingAvatar ? "opacity-50 cursor-not-allowed" : ""}
                          `,
                          allowedContent: "text-white/60 text-xs mt-2",
                          container: "flex flex-col items-start",
                        }}
                        content={{
                          button: uploadingAvatar ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Upload Avatar
                            </div>
                          ),
                          allowedContent: "JPG, PNG up to 2MB",
                        }}
                        disabled={uploadingAvatar}
                      />
                      <Badge variant="outline" className="border-white/20 text-white/80 bg-white/5">
                        2MB max
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Personal Information Form */}
                <form onSubmit={handleSavePersonal} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={profile.name || ""}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={profile.email || ""}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-blue-400" />
                      <div>
                        <h3 className="text-white font-medium">Account Information</h3>
                        <p className="text-white/60 text-sm">
                          Member since: {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={saving} className="bg-white text-black hover:bg-white/90">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
                <CardDescription className="text-white/60">Manage your account security and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-400" />
                      <div>
                        <h3 className="text-white font-medium">Account Status</h3>
                        <p className="text-white/60 text-sm">Your account is secure and active</p>
                        <p className="text-white/60 text-sm">
                          Created: {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-zinc-900 border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/60">
                            This action cannot be undone. This will permanently delete your account and remove your data
                            from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
