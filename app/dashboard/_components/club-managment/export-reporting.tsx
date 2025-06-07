"use client"

import {useState} from "react"
import {Download, FileText, Users, Calendar, BarChart3} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Checkbox} from "@/components/ui/checkbox"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Badge} from "@/components/ui/badge"
import {DatePickerWithRange} from "@/components/date-range-picker";
import {DateRange} from "react-day-picker"

interface ExportReportingProps {
    clubId: string
}

export function ExportReporting({clubId}: ExportReportingProps) {
    const [selectedReports, setSelectedReports] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const [exportFormat, setExportFormat] = useState("csv")

    const reportTypes = [
        {
            id: "members",
            name: "Member Directory",
            description: "Complete member list with contact information and roles",
            icon: Users,
            fields: ["Name", "Email", "Phone", "Role", "Join Date", "Status"],
        },
        {
            id: "attendance",
            name: "Attendance Report",
            description: "Member attendance data for events and training sessions",
            icon: Calendar,
            fields: ["Member", "Event", "Date", "Status", "Check-in Time"],
        },
        {
            id: "events",
            name: "Event Summary",
            description: "Complete event history with attendance and details",
            icon: Calendar,
            fields: ["Event Name", "Date", "Type", "Attendees", "Location"],
        },
        {
            id: "performance",
            name: "Performance Statistics",
            description: "Club and member performance metrics and achievements",
            icon: BarChart3,
            fields: ["Member", "Total Events", "Attendance %", "Achievements"],
        },
        {
            id: "financial",
            name: "Financial Report",
            description: "Membership fees and payment tracking",
            icon: FileText,
            fields: ["Member", "Plan", "Amount", "Payment Date", "Status"],
        },
    ]

    const handleReportToggle = (reportId: string) => {
        setSelectedReports((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]))
    }

    const handleExport = () => {
        // In real app, trigger export API call
        console.log("Exporting reports:", {
            reports: selectedReports,
            format: exportFormat,
            dateRange,
        })
    }

    const handleQuickExport = (type: string) => {
        // Quick export without customization
        console.log(`Quick exporting ${type}`)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Export & Reporting</CardTitle>
                    <CardDescription className="text-white/60">
                        Generate and export detailed reports about your club's data and performance
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Quick Export Actions */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Quick Export</CardTitle>
                    <CardDescription className="text-white/60">One-click exports for common data
                        requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                            variant="outline"
                            className="h-20 flex-col gap-2 border-white/10 hover:bg-white/5"
                            onClick={() => handleQuickExport("all-members")}
                        >
                            <Users className="h-6 w-6"/>
                            <span>All Members</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col gap-2 border-white/10 hover:bg-white/5"
                            onClick={() => handleQuickExport("recent-attendance")}
                        >
                            <Calendar className="h-6 w-6"/>
                            <span>Recent Attendance</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col gap-2 border-white/10 hover:bg-white/5"
                            onClick={() => handleQuickExport("club-stats")}
                        >
                            <BarChart3 className="h-6 w-6"/>
                            <span>Club Statistics</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex-col gap-2 border-white/10 hover:bg-white/5"
                            onClick={() => handleQuickExport("financial")}
                        >
                            <FileText className="h-6 w-6"/>
                            <span>Financial Data</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Custom Report Builder */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Custom Report Builder</CardTitle>
                    <CardDescription className="text-white/60">
                        Select specific data types and customize your export
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Report Type Selection */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Select Report Types</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reportTypes.map((report) => (
                                <Card
                                    key={report.id}
                                    className={`cursor-pointer transition-all duration-200 ${
                                        selectedReports.includes(report.id)
                                            ? "bg-emerald-500/20 border-emerald-500/50"
                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                    }`}
                                    onClick={() => handleReportToggle(report.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={selectedReports.includes(report.id)}
                                                onChange={() => handleReportToggle(report.id)}
                                            />
                                            <report.icon className="h-5 w-5 mt-0.5 text-emerald-500"/>
                                            <div className="flex-1">
                                                <h5 className="font-medium">{report.name}</h5>
                                                <p className="text-sm text-white/60 mt-1">{report.description}</p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {report.fields.slice(0, 3).map((field) => (
                                                        <Badge
                                                            key={field}
                                                            variant="outline"
                                                            className="bg-white/5 text-white/60 border-white/10 text-xs"
                                                        >
                                                            {field}
                                                        </Badge>
                                                    ))}
                                                    {report.fields.length > 3 && (
                                                        <Badge variant="outline"
                                                               className="bg-white/5 text-white/60 border-white/10 text-xs">
                                                            +{report.fields.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Export Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className="font-medium">Date Range (Optional)</h4>
                            <DatePickerWithRange
                                date={dateRange}
                                onDateChange={setDateRange}
                                className="bg-zinc-800/50 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Export Format</h4>
                            <Select value={exportFormat} onValueChange={setExportFormat}>
                                <SelectTrigger className="bg-zinc-800/50 border-white/10">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                                    <SelectItem value="pdf">PDF Report</SelectItem>
                                    <SelectItem value="json">JSON Data</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleExport}
                            disabled={selectedReports.length === 0}
                            className="bg-emerald-500 hover:bg-emerald-600"
                        >
                            <Download className="mr-2 h-4 w-4"/>
                            Export Selected Reports ({selectedReports.length})
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Export History */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Recent Exports</CardTitle>
                    <CardDescription className="text-white/60">Download previously generated reports</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            {name: "Member Directory - June 2024", date: "2024-06-10", format: "CSV", size: "2.3 MB"},
                            {name: "Attendance Report - May 2024", date: "2024-06-05", format: "Excel", size: "1.8 MB"},
                            {name: "Performance Statistics Q2", date: "2024-06-01", format: "PDF", size: "4.1 MB"},
                        ].map((export_, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-white/60"/>
                                    <div>
                                        <p className="font-medium">{export_.name}</p>
                                        <p className="text-sm text-white/60">
                                            {export_.date} • {export_.format} • {export_.size}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                                    <Download className="mr-2 h-4 w-4"/>
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
