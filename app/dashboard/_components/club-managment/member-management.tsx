"use client"

import {useEffect, useState} from "react"
import {Search, Download, Edit3, Eye, Trash2, MoreHorizontal, UserPlus} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {getPaginatedMembers} from "../../_actions/get-members"

interface Member {
    id: string
    name: string
    email: string
    role: string
    status: string
    joinDate: string
    attendance: number
    totalEvents: number
    avatar: string | null
}


interface MemberManagementProps {
    clubId: string
}

export function MemberManagement({clubId}: MemberManagementProps) {
    const [members, setMembers] = useState<Member[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalMembers, setTotalMembers] = useState(0)
    const [loading, setLoading] = useState(true)
    const membersPerPage = 10

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const res = await getPaginatedMembers(clubId, currentPage, membersPerPage)
            setMembers(res.members)
            setTotalMembers(res.total)
            setLoading(false)
        }

        fetchData()
    }, [clubId, currentPage])

    const totalPages = Math.ceil(totalMembers / membersPerPage)

    // Filter members based on search and filters
    const filteredMembers = members.filter((member) => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || member.role.toLowerCase() === roleFilter
        const matchesStatus = statusFilter === "all" || member.status.toLowerCase() === statusFilter

        return matchesSearch && matchesRole && matchesStatus
    })

    // Pagination
    const startIndex = (currentPage - 1) * membersPerPage
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + membersPerPage)

    const handleSelectMember = (memberId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        )
    }

    const handleSelectAll = () => {
        if (selectedMembers.length === paginatedMembers.length) {
            setSelectedMembers([])
        } else {
            setSelectedMembers(paginatedMembers.map((m) => m.id))
        }
    }

    const exportSelectedMembers = () => {
        const selectedData = members.filter((m) => selectedMembers.includes(m.id))
        // In real app, implement CSV export
        console.log("Exporting members:", selectedData)
    }

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-red-500/20 text-red-500"
            case "coach":
                return "bg-blue-500/20 text-blue-500"
            default:
                return "bg-gray-500/20 text-gray-400"
        }
    }

    const getStatusColor = (status: string) => {
        return status === "Active" ? "bg-emerald-500/20 text-emerald-500" : "bg-orange-500/20 text-orange-500"
    }

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-white/60">Loading members...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Member Management</CardTitle>
                        <CardDescription className="text-white/60">
                            Manage your club members, roles, and permissions
                        </CardDescription>
                    </div>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4"/>
                        Add Member
                    </Button>
                </CardHeader>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50"/>
                            <Input
                                placeholder="Search members by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-zinc-800/50 border-white/10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-40 bg-zinc-800/50 border-white/10">
                                <SelectValue placeholder="Role"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="coach">Coach</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40 bg-zinc-800/50 border-white/10">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {selectedMembers.length > 0 && (
                            <Button variant="outline" onClick={exportSelectedMembers}
                                    className="border-white/10 hover:bg-white/5">
                                <Download className="mr-2 h-4 w-4"/>
                                Export ({selectedMembers.length})
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-white/10 text-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10">
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Attendance</TableHead>
                                    <TableHead>Events</TableHead>
                                    <TableHead className="w-12">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedMembers.map((member) => (
                                    <TableRow key={member.id} className="border-white/10">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedMembers.includes(member.id)}
                                                onCheckedChange={() => handleSelectMember(member.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={member.avatar || "/placeholder.svg"}
                                                                 alt={member.name}/>
                                                    <AvatarFallback>
                                                        {member.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{member.name}</p>
                                                    <p className="text-sm text-white/60">{member.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline"
                                                   className={`border-0 ${getRoleColor(member.role)}`}>
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline"
                                                   className={`border-0 ${getStatusColor(member.status)}`}>
                                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell
                                            className="text-white/70">{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white/70">{member.attendance}%</span>
                                                <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 transition-all duration-300"
                                                        style={{width: `${member.attendance}%`}}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-white/70">{member.totalEvents}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4"/>
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit3 className="mr-2 h-4 w-4"/>
                                                        Edit Member
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4"/>
                                                        Export Data
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem className="text-red-400">
                                                        <Trash2 className="mr-2 h-4 w-4"/>
                                                        Remove Member
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <Card className="bg-zinc-900/50 border-white/10 text-white">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-white/60">
                                Showing {startIndex + 1} to {Math.min(startIndex + membersPerPage, filteredMembers.length)} of{" "}
                                {filteredMembers.length} members
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm px-3 py-1 bg-white/10 rounded">
                  {currentPage} of {totalPages}
                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
