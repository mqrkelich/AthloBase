'use client'

import {DropdownMenuItem} from '@/components/ui/dropdown-menu'
import {LogOut} from 'lucide-react'
import {signOutAction} from '@/actions/login'

export function SignOutButton() {
    const handleSignOut = async () => {
        await signOutAction()
    }

    return (
        <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4"/>
            <span>Log out</span>
        </DropdownMenuItem>
    )
}
