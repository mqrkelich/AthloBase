"use client"

import {useState} from "react"
import {Edit3, Plus, Trash2} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Badge} from "@/components/ui/badge"

interface ClubStat {
    id: number
    label: string
    value: string
    unit: string
    icon: any
}

interface ClubData {
    customStats: ClubStat[]

    [key: string]: any
}

interface ClubOverviewPanelProps {
    clubData: ClubData
}

export function ClubOverviewPanel({clubData}: ClubOverviewPanelProps) {
    const [stats, setStats] = useState(clubData.customStats)
    const [editingStat, setEditingStat] = useState<ClubStat | null>(null)
    const [isAddingNew, setIsAddingNew] = useState(false)

    const handleEditStat = (stat: ClubStat) => {
        setEditingStat(stat)
    }

    const handleSaveStat = (updatedStat: ClubStat) => {
        setStats((prev) => prev.map((s) => (s.id === updatedStat.id ? updatedStat : s)))
        setEditingStat(null)
    }

    const handleAddStat = (newStat: Omit<ClubStat, "id">) => {
        const stat = {...newStat, id: Date.now()}
        setStats((prev) => [...prev, stat])
        setIsAddingNew(false)
    }

    const handleDeleteStat = (id: number) => {
        setStats((prev) => prev.filter((s) => s.id !== id))
    }

    return (
        <div className="space-y-6">
            {/* Custom Statistics */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Club Statistics</CardTitle>
                        <CardDescription className="text-white/60">Track your club's key performance
                            metrics</CardDescription>
                    </div>
                    <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                                <Plus className="mr-2 h-4 w-4"/>
                                Add Stat
                            </Button>
                        </DialogTrigger>
                        <StatDialog onSave={handleAddStat} onCancel={() => setIsAddingNew(false)}/>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.id} className="group relative">
                                <Card
                                    className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-200">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <stat.icon className="h-6 w-6 text-emerald-500"/>
                                            <div
                                                className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6"
                                                        onClick={() => handleEditStat(stat)}>
                                                    <Edit3 className="h-3 w-3"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-red-400 hover:text-red-300"
                                                    onClick={() => handleDeleteStat(stat.id)}
                                                >
                                                    <Trash2 className="h-3 w-3"/>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-bold">
                                                {stat.value}
                                                <span
                                                    className="text-sm font-normal text-white/60 ml-1">{stat.unit}</span>
                                            </p>
                                            <p className="text-sm text-white/70">{stat.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription className="text-white/60">Latest updates and member activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            {action: "New member joined", member: "Sarah Johnson", time: "2 hours ago", type: "join"},
                            {action: "Event completed", event: "Morning Run", time: "1 day ago", type: "event"},
                            {
                                action: "Member achievement",
                                member: "Mike Chen",
                                achievement: "100 runs milestone",
                                time: "2 days ago",
                                type: "achievement",
                            },
                            {
                                action: "New event created",
                                event: "Weekend Trail Run",
                                time: "3 days ago",
                                type: "event"
                            },
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`h-2 w-2 rounded-full ${
                                            activity.type === "join"
                                                ? "bg-emerald-500"
                                                : activity.type === "event"
                                                    ? "bg-blue-500"
                                                    : "bg-orange-500"
                                        }`}
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{activity.action}</p>
                                        <p className="text-xs text-white/60">
                                            {activity.member && `${activity.member} • `}
                                            {activity.event && `${activity.event} • `}
                                            {activity.achievement && `${activity.achievement} • `}
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-white/5 text-white/60 border-white/10 text-xs">
                                    {activity.type}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Stat Dialog */}
            {editingStat && (
                <Dialog open={!!editingStat} onOpenChange={() => setEditingStat(null)}>
                    <StatDialog stat={editingStat} onSave={handleSaveStat} onCancel={() => setEditingStat(null)}/>
                </Dialog>
            )}
        </div>
    )
}

function StatDialog({
                        stat,
                        onSave,
                        onCancel,
                    }: {
    stat?: ClubStat
    onSave: (stat: any) => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        label: stat?.label || "",
        value: stat?.value || "",
        unit: stat?.unit || "",
        icon: stat?.icon?.name || "Activity",
    })

    const iconOptions = [
        {name: "Activity", component: "Activity"},
        {name: "Target", component: "Target"},
        {name: "Users", component: "Users"},
        {name: "Trophy", component: "Trophy"},
        {name: "Clock", component: "Clock"},
    ]

    const handleSubmit = () => {
        const iconComponent = iconOptions.find((i) => i.name === formData.icon)?.component || "Activity"


        onSave({
            ...stat,
            ...formData,
            icon: eval(iconComponent), // In real app, use proper icon mapping
        })
    }

    return (
        <DialogContent className="bg-zinc-900 border-white/10 text-white">
            <DialogHeader>
                <DialogTitle>{stat ? "Edit Statistic" : "Add New Statistic"}</DialogTitle>
                <DialogDescription className="text-white/60">Configure your custom club statistic</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData((prev) => ({...prev, label: e.target.value}))}
                        placeholder="e.g., Total Runs"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                        id="value"
                        value={formData.value}
                        onChange={(e) => setFormData((prev) => ({...prev, value: e.target.value}))}
                        placeholder="e.g., 1,247"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData((prev) => ({...prev, unit: e.target.value}))}
                        placeholder="e.g., runs, miles, %"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={formData.icon}
                            onValueChange={(value) => setFormData((prev) => ({...prev, icon: value}))}>
                        <SelectTrigger className="bg-zinc-800/50 border-white/10">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {iconOptions.map((icon) => (
                                <SelectItem key={icon.name} value={icon.name}>
                                    {icon.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} className="border-white/10 hover:bg-white/5">
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>{stat ? "Save Changes" : "Add Statistic"}</Button>
            </DialogFooter>
        </DialogContent>
    )
}
