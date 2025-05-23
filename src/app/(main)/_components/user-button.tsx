"use client";
import { TooltipProvider } from "@/components/tooltip-provider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

import { User, BadgeDollarSign, LogOut, Settings } from "lucide-react";

export const UserDropdown = ({ children }: { children: React.ReactNode }) => {
  return (
    <DropdownMenu>
      <TooltipProvider title="Your Profile">
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      </TooltipProvider>
      <DropdownMenuContent align="end" side="bottom">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BadgeDollarSign className="mr-2 h-4 w-4" />
          Subscription
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-rose-500 hover:text-rose-500"
        >
          <LogOut className="mr-2 h-4 w-4 text-rose-500 hover:text-rose-500" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
