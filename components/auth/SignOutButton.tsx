"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
    return (
        <Button
            variant="ghost"
            className="justify-start text-red-500 hover:bg-red-500/10 hover:text-red-400 w-full"
            onClick={() => signOut({ callbackUrl: "/login" })}
        >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
    );
}
