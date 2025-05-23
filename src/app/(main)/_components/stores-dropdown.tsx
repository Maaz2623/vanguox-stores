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
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const StoresDropdown = ({ children }: { children: React.ReactNode }) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.stores.getStoresByUser.queryOptions());

  const [open, setOpen] = useState(false);

  const router = useRouter();

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
              {data.map((store) => (
                <DropdownMenuItem
                  onClick={() => router.push(`/stores/${store.name}`)}
                  key={store.id}
                >
                  {store.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <PlusCircle className=" h-4 w-4" />
            Create
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateStoreDialog open={open} setOpen={setOpen} />
    </>
  );
};
