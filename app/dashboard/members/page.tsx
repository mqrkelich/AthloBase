"use client"

import { useEffect, useState } from "react"
import { Search, Download, MoreHorizontal, Crown, Star, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { getAllMembers, exportMembersData } from "./_actions/members-data"
import { MemberProfileDialog } from "../(overview)/_components/member-profile-dialog"
import { MemberAttendanceDialog } from "../(overview)/_components/member-attendance-dialog"

interface Member {
  id: string
  name: string
  email: string | null
  image: string | null
  role: string
  joinedAt: string
  lastActive: string
  attendanceRate: number
  eventsAttended: number
  clubId: string
  clubName: string
  clubLogo: string | null
}

interface Club {
  id: string
  name: string
  logo: string | null
  memberCount: number
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [userRole, setUserRole] = useState<"owner" | "member">("owner")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClub, setSelectedClub] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [exporting, setExporting] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const data = await getAllMembers()
      setMembers(data.members)
      setClubs(data.clubs)
      setUserRole("owner")
      console.log("Loaded members:", data.members.length)
      console.log(
        "Member roles:",
        data.members.map((m) => ({ name: m.name, role: m.role })),
      )
    } catch (error) {
      console.error("Failed to load members:", error)
      toast.error("Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (userRole !== "owner") {
      toast.error("Only club owners can export member data")
      return
    }

    try {
      setExporting(true)
      const data = await exportMembersData()

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `members-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Member data exported successfully")
    } catch (error) {
      console.error("Failed to export data:", error)
      toast.error("Failed to export member data")
    } finally {
      setExporting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "admin":
        return <Star className="h-3 w-3 text-blue-400" />
      default:
        return null
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      case "admin":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-white/10 text-white/80 border-white/20"
    }
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-400"
    if (rate >= 70) return "text-yellow-400"
    if (rate >= 50) return "text-orange-400"
    return "text-red-400"
  }

  const getAttendanceBadgeColor = (rate: number) => {
    if (rate >= 90) return "bg-green-500/20 text-green-400 border-green-500/30"
    if (rate >= 70) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    if (rate >= 50) return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    return "bg-red-500/20 text-red-400 border-red-500/30"
  }

  // Filter members based on search and filters
  const filteredMembers = members.filter((member) => {
    console.log(`Filtering member ${member.name} with role ${member.role}, selectedRole: ${selectedRole}`)

    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesClub = selectedClub === "all" || member.clubId === selectedClub

    // Fix role filtering - ensure exact string comparison
    const matchesRole = selectedRole === "all" || member.role.toLowerCase() === selectedRole.toLowerCase()

    const result = matchesSearch && matchesClub && matchesRole
    console.log(
      `Member ${member.name}: search=${matchesSearch}, club=${matchesClub}, role=${matchesRole}, final=${result}`,
    )

    return result
  })

  console.log("Filtered members count:", filteredMembers.length)
  console.log("Selected role filter:", selectedRole)

  const handleViewProfile = (member: Member) => {
    setSelectedMember(member)
    setShowProfileDialog(true)
  }

  const handleViewAttendance = (member: Member) => {
    setSelectedMember(member)
    setShowAttendanceDialog(true)
  }

  // Get unique roles from members for debugging
  const uniqueRoles = [...new Set(members.map((m) => m.role))]
  console.log("Unique roles found:", uniqueRoles)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 mb-2 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-96 bg-white/10 rounded animate-pulse" />
          </div>
          <Card className="bg-black/40 border-white/10 backdrop-blur-md mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="h-10 flex-1 bg-white/10 rounded animate-pulse" />
                <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
                <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-10 w-24 bg-white/10 rounded animate-pulse" />
              </div>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="bg-black/40 border-white/10 backdrop-blur-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse" />
                      <div>
                        <div className="h-4 w-24 mb-1 bg-white/10 rounded animate-pulse" />
                        <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-8 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-white/10 animate-pulse" />
                      <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Members</h1>
          <p className="text-white/60">Manage and view all members across your clubs</p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-md mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search members by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {/* Club Filter */}
              <Select value={selectedClub} onValueChange={setSelectedClub}>
                <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Filter by club" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-white/10">
                    All Clubs ({members.length})
                  </SelectItem>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id} className="text-white hover:bg-white/10">
                      {club.name} ({club.memberCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  console.log("Role filter changed to:", value)
                  setSelectedRole(value)
                }}
              >
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-white/10">
                    All Roles
                  </SelectItem>
                  <SelectItem value="owner" className="text-white hover:bg-white/10">
                    Owners
                  </SelectItem>
                  <SelectItem value="admin" className="text-white hover:bg-white/10">
                    Admins
                  </SelectItem>
                  <SelectItem value="member" className="text-white hover:bg-white/10">
                    Members
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              {userRole === "owner" && (
                <Button onClick={handleExport} disabled={exporting} className="bg-white text-black hover:bg-white/90">
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? "Exporting..." : "Export"}
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-white/60">
            Showing {filteredMembers.length} of {members.length} members
            {selectedRole !== "all" && ` with role: ${selectedRole}`}
            {selectedClub !== "all" && ` in selected club`}
          </p>
        </div>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <Card className="bg-black/40 border-white/10 backdrop-blur-md">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No members found</h3>
              <p className="text-white/60">
                {searchTerm || selectedClub !== "all" || selectedRole !== "all"
                  ? "Try adjusting your search or filters"
                  : "No members to display"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={`${member.id}-${member.clubId}`}
                className="bg-black/40 border-white/10 backdrop-blur-md hover:bg-black/60 transition-colors"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="bg-white/10 text-white">{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-white truncate">{member.name}</p>
                          {getRoleIcon(member.role)}
                        </div>
                        <Badge variant="outline" className={`text-xs border-0 ${getRoleBadgeColor(member.role)}`}>
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    {userRole === "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-800 border-white/10">
                          <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => handleViewProfile(member)}
                          >
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => handleViewAttendance(member)}
                          >
                            View Attendance
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-white/10">Send Message</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Attendance Rate */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Attendance</span>
                      <Badge
                        variant="outline"
                        className={`text-xs border-0 ${getAttendanceBadgeColor(member.attendanceRate)}`}
                      >
                        {member.attendanceRate}%
                      </Badge>
                    </div>

                    {/* Club */}
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={member.clubLogo || "/placeholder.svg"} alt={member.clubName} />
                        <AvatarFallback className="bg-white/10 text-white text-xs">{member.clubName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white/80 truncate">{member.clubName}</span>
                    </div>

                    {/* Events Attended */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-white/40" />
                      <span className="text-sm text-white/60">{member.eventsAttended} events attended</span>
                    </div>

                    {/* Join Date */}
                    <p className="text-xs text-white/40">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Member Profile Dialog */}
        {selectedMember && (
          <MemberProfileDialog
            open={showProfileDialog}
            onOpenChange={setShowProfileDialog}
            memberId={selectedMember.id}
            clubId={selectedMember.clubId}
          />
        )}

        {/* Member Attendance Dialog */}
        {selectedMember && (
          <MemberAttendanceDialog
            open={showAttendanceDialog}
            onOpenChange={setShowAttendanceDialog}
            memberId={selectedMember.id}
            clubId={selectedMember.clubId}
          />
        )}
      </div>
    </div>
  )
}
