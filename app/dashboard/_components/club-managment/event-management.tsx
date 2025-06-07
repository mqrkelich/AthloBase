"use client"

import {useState} from "react"
import {Calendar, Clock, MapPin, Users, Plus, Edit3, Trash2, Search} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"

// Mock event data
const mockEvents = [
    {
        id: 1,
        title: "Morning Track Practice",
        type: "Training",
        date: "2024-06-15",
        time: "06:00",
        duration: 90,
        location: "Central Park Track",
        attendees: 23,
        maxAttendees: 30,
        status: "Scheduled",
        recurring: "Weekly",
        description: "High-intensity interval training session",
        coach: "Emma Davis",
    },
    {
        id: 2,
        title: "Weekend Long Run",
        type: "Training",
        date: "2024-06-16",
        time: "07:00",
        duration: 120,
        location: "Central Park Loop",
        attendees: 18,
        maxAttendees: 25,
        status: "Scheduled",
        recurring: "Weekly",
        description: "Endurance building long distance run",
        coach: "Sarah Johnson",
    },
    {
        id: 3,
        title: "Monthly Team Meeting",
        type: "Meeting",
        date: "2024-06-20",
        time: "19:00",
        duration: 60,
        location: "Community Center",
        attendees: 45,
        maxAttendees: 50,
        status: "Scheduled",
        recurring: "Monthly",
        description: "Club updates and planning session",
        coach: "Sarah Johnson",
    },
    {
        id: 4,
        title: "5K Race Preparation",
        type: "Competition",
        date: "2024-06-22",
        time: "08:00",
        duration: 180,
        location: "City Stadium",
        attendees: 32,
        maxAttendees: 40,
        status: "Scheduled",
        recurring: "None",
        description: "Final preparation for upcoming 5K race",
        coach: "Emma Davis",
    },
]

interface EventManagementProps {
    clubId: string
}

export function EventManagement({clubId}: EventManagementProps) {
    const [events, setEvents] = useState(mockEvents)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [isAddingEvent, setIsAddingEvent] = useState(false)

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === "all" || event.type.toLowerCase() === typeFilter
        const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "training":
                return "bg-blue-500/20 text-blue-500"
            case "competition":
                return "bg-red-500/20 text-red-500"
            case "meeting":
                return "bg-purple-500/20 text-purple-500"
            default:
                return "bg-gray-500/20 text-gray-400"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "scheduled":
                return "bg-emerald-500/20 text-emerald-500"
            case "completed":
                return "bg-gray-500/20 text-gray-400"
            case "cancelled":
                return "bg-red-500/20 text-red-500"
            default:
                return "bg-gray-500/20 text-gray-400"
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Event & Training Management</CardTitle>
                        <CardDescription className="text-white/60">
                            Schedule and manage club events, training sessions, and competitions
                        </CardDescription>
                    </div>
                    <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4"/>
                                Add Event
                            </Button>
                        </DialogTrigger>
                        <EventDialog onClose={() => setIsAddingEvent(false)}/>
                    </Dialog>
                </CardHeader>
            </Card>

            {/* Filters */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50"/>
                            <Input
                                placeholder="Search events by title or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-zinc-800/50 border-white/10"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-40 bg-zinc-800/50 border-white/10">
                                <SelectValue placeholder="Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                                <SelectItem value="competition">Competition</SelectItem>
                                <SelectItem value="meeting">Meeting</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40 bg-zinc-800/50 border-white/10">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <Card
                        key={event.id}
                        className="bg-zinc-900/50 border-white/10 text-white hover:border-white/20 transition-colors"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="text-lg">{event.title}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={`border-0 ${getTypeColor(event.type)}`}>
                                            {event.type}
                                        </Badge>
                                        <Badge variant="outline" className={`border-0 ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Edit3 className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400">
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-white/70">{event.description}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-white/60">
                                    <Calendar className="h-4 w-4"/>
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Clock className="h-4 w-4"/>
                                    <span>
                    {event.time} ({event.duration} min)
                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <MapPin className="h-4 w-4"/>
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Users className="h-4 w-4"/>
                                    <span>
                    {event.attendees}/{event.maxAttendees} attending
                  </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <div className="text-xs text-white/60">Coach: {event.coach}</div>
                                {event.recurring !== "None" && (
                                    <Badge variant="outline"
                                           className="bg-white/5 text-white/60 border-white/10 text-xs">
                                        {event.recurring}
                                    </Badge>
                                )}
                            </div>

                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                    style={{width: `${(event.attendees / event.maxAttendees) * 100}%`}}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function EventDialog({onClose}: { onClose: () => void }) {
    const [formData, setFormData] = useState({
        title: "",
        type: "training",
        date: "",
        time: "",
        duration: 60,
        location: "",
        maxAttendees: 30,
        description: "",
        recurring: "none",
        coach: "",
    })

    const handleSubmit = () => {
        // In real app, save event to backend
        console.log("Creating event:", formData)
        onClose()
    }

    return (
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-2xl">
            <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription className="text-white/60">
                    Schedule a new training session, competition, or meeting
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({...prev, title: e.target.value}))}
                        placeholder="e.g., Morning Track Practice"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={formData.type}
                            onValueChange={(value) => setFormData((prev) => ({...prev, type: value}))}>
                        <SelectTrigger className="bg-zinc-800/50 border-white/10">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="competition">Competition</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData((prev) => ({...prev, date: e.target.value}))}
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData((prev) => ({...prev, time: e.target.value}))}
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData((prev) => ({...prev, duration: Number.parseInt(e.target.value)}))}
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                        id="maxAttendees"
                        type="number"
                        value={formData.maxAttendees}
                        onChange={(e) => setFormData((prev) => ({
                            ...prev,
                            maxAttendees: Number.parseInt(e.target.value)
                        }))}
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData((prev) => ({...prev, location: e.target.value}))}
                        placeholder="e.g., Central Park Track"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({...prev, description: e.target.value}))}
                        placeholder="Describe the event..."
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="recurring">Recurring</Label>
                    <Select
                        value={formData.recurring}
                        onValueChange={(value) => setFormData((prev) => ({...prev, recurring: value}))}
                    >
                        <SelectTrigger className="bg-zinc-800/50 border-white/10">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No Repeat</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="coach">Coach/Organizer</Label>
                    <Input
                        id="coach"
                        value={formData.coach}
                        onChange={(e) => setFormData((prev) => ({...prev, coach: e.target.value}))}
                        placeholder="e.g., Emma Davis"
                        className="bg-zinc-800/50 border-white/10"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5">
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>Create Event</Button>
            </DialogFooter>
        </DialogContent>
    )
}
