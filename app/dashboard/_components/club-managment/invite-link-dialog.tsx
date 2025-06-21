"use client"

import {useState} from "react"
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
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Copy, Link, Mail, Users, Clock, Shield, Check, RefreshCw, Calendar} from "lucide-react"
import {generateUniqueInviteCode} from "@/app/onboarding/_actions/create-club";

interface InviteLinkDialogProps {
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    clubName: string
    clubId: string
    inviteCode: string
    webUrl: string
}

export function InviteLinkDialog({
                                     open,
                                     onOpenChangeAction,
                                     clubName,
                                     clubId,
                                     webUrl,
                                     inviteCode
                                 }: InviteLinkDialogProps) {
    const [activeTab, setActiveTab] = useState("general")
    const [email, setEmail] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

    // Mock invitation data
    const [generalInvite] = useState({
        url: `${webUrl}/invite/${clubId}/${inviteCode}`,
        code: `${inviteCode}`,
    })

    const [personalInvite, setPersonalInvite] = useState<{
        url: string
        code: string
        email: string
    } | null>(null)

    const copyToClipboard = async (text: string, key: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedStates({...copiedStates, [key]: true})
            setTimeout(() => {
                setCopiedStates({...copiedStates, [key]: false})
            }, 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const generatePersonalInvite = async () => {
        if (!email.trim()) return

        setIsGenerating(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const inviteCode = await generateUniqueInviteCode()
        const inviteUrl = `${webUrl}/invite/${clubId}/${inviteCode.toLowerCase()}`

        setPersonalInvite({
            url: inviteUrl,
            code: inviteCode,
            email: email,
        })

        setIsGenerating(false)
    }

    const regenerateGeneralInvite = async () => {
        setIsGenerating(true)
        // Simulate API call to regenerate
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsGenerating(false)
    }

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5"/>
                        Invite People to {clubName}
                    </DialogTitle>
                    <DialogDescription>
                        Share an invitation link or create a personal invite for someone specific.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="general" className="flex items-center gap-2">
                            <Link className="h-4 w-4"/>
                            General Invite
                        </TabsTrigger>
                        <TabsTrigger value="personal" className="flex items-center gap-2">
                            <Mail className="h-4 w-4"/>
                            Personal Invite
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Link className="h-5 w-5"/>
                                    General Invitation Link
                                </CardTitle>
                                <CardDescription>
                                    Anyone with this link can join your club.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Invitation URL</Label>
                                    <div className="flex gap-2">
                                        <Input value={generalInvite.url} readOnly className="font-mono text-sm"/>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(generalInvite.url, "general-url")}
                                        >
                                            {copiedStates["general-url"] ? (
                                                <Check className="h-4 w-4 text-green-500"/>
                                            ) : (
                                                <Copy className="h-4 w-4"/>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Invitation Code</Label>
                                    <div className="flex gap-2">
                                        <Input value={generalInvite.code} readOnly
                                               className="font-mono text-lg font-bold tracking-wider"/>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(generalInvite.code, "general-code")}
                                        >
                                            {copiedStates["general-code"] ? (
                                                <Check className="h-4 w-4 text-green-500"/>
                                            ) : (
                                                <Copy className="h-4 w-4"/>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full" onClick={regenerateGeneralInvite}
                                        disabled={isGenerating}>
                                    {isGenerating ? (
                                        <>
                                            <div
                                                className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"/>
                                            Regenerating...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2"/>
                                            Regenerate Link
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="personal" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Mail className="h-5 w-5"/>
                                    Personal Invitation
                                </CardTitle>
                                <CardDescription>
                                    Create a one-time invitation link for a specific person. Only they can use this
                                    link.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="personal-email">Email Address</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="personal-email"
                                            type="email"
                                            placeholder="member@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isGenerating}
                                        />
                                        <Button onClick={generatePersonalInvite}
                                                disabled={!validateEmail(email) || isGenerating}>
                                            {isGenerating ? (
                                                <>
                                                    <div
                                                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"/>
                                                    Creating...
                                                </>
                                            ) : (
                                                "Generate"
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {personalInvite && (
                                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Check className="h-4 w-4 text-green-500"/>
                                            Personal invitation created for {personalInvite.email}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Invitation URL</Label>
                                                <div className="flex gap-2">
                                                    <Input value={personalInvite.url} readOnly
                                                           className="font-mono text-sm"/>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => copyToClipboard(personalInvite.url, "personal-url")}
                                                    >
                                                        {copiedStates["personal-url"] ? (
                                                            <Check className="h-4 w-4 text-green-500"/>
                                                        ) : (
                                                            <Copy className="h-4 w-4"/>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs">Invitation Code</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={personalInvite.code}
                                                        readOnly
                                                        className="font-mono text-lg font-bold tracking-wider"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => copyToClipboard(personalInvite.code, "personal-code")}
                                                    >
                                                        {copiedStates["personal-code"] ? (
                                                            <Check className="h-4 w-4 text-green-500"/>
                                                        ) : (
                                                            <Copy className="h-4 w-4"/>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
