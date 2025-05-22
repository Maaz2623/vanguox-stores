"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

import { Store, PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreateStoreDialog } from "./create-store-dialog";

export const StoresDropdown = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuLabel>Manage Stores</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Store className="mr-2 h-4 w-4" />
              My stores
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Store A</DropdownMenuItem>
              <DropdownMenuItem>Store B</DropdownMenuItem>
              <DropdownMenuItem>Store C</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create  
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateStoreDialog open={open} setOpen={setOpen} />
    </>
  );
};
