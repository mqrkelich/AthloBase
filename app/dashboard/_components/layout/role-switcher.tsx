"use client"

import {useState} from "react"
import {Crown, Users, SwitchCameraIcon as Switch} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import {switchRole} from "@/app/dashboard/_actions/switch-role";
import {useRouter} from "next/navigation";

interface RoleSwitcherProps {
    currentRole: "owner" | "member"
}

export function RoleSwitcher({currentRole}: RoleSwitcherProps) {
    const [role, setRole] = useState(currentRole)
    const router = useRouter()

    const handleRoleSwitch = async (newRole: "owner" | "member") => {


        await switchRole(newRole);
        router.refresh()

        setRole(newRole)

    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"
                        className="w-full justify-between border-white/10 hover:bg-white/5 text-white">
                    <div className="flex items-center gap-2">
                        {role === "owner" ? (
                            <Crown className="h-4 w-4 text-emerald-500"/>
                        ) : (
                            <Users className="h-4 w-4 text-blue-500"/>
                        )}
                        <span className="capitalize">{role} View</span>
                    </div>
                    <Switch className="h-4 w-4 opacity-50"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={() => handleRoleSwitch("owner")}
                    className={role === "owner" ? "bg-zinc-800/50" : ""}
                >
                    <Crown className="mr-2 h-4 w-4 text-emerald-500"/>
                    <span>Club Owner</span>
                    {role === "owner" && (
                        <Badge variant="outline"
                               className="ml-auto text-xs bg-emerald-500/20 text-emerald-500 border-0">
                            Active
                        </Badge>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleRoleSwitch("member")}
                    className={role === "member" ? "bg-zinc-800/50" : ""}
                >
                    <Users className="mr-2 h-4 w-4 text-blue-500"/>
                    <span>Club Member</span>
                    {role === "member" && (
                        <Badge variant="outline" className="ml-auto text-xs bg-blue-500/20 text-blue-500 border-0">
                            Active
                        </Badge>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
