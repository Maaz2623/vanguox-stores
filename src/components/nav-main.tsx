"use client";

import { IconDashboard } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PackageIcon } from "lucide-react";
import { CreateStoreDialog } from "@/app/(main)/_components/create-store-dialog";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({ storeName }: { storeName: string }) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const navMain = [
    {
      title: "Overview",
      url: `/stores/${storeName}`,
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: `/stores/${storeName}/products`,
      icon: PackageIcon,
    },
  ];

  return (
    <>
      <CreateStoreDialog open={open} setOpen={setOpen} />
      <SidebarGroup>
        <SidebarGroupLabel>Manage</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {navMain.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn("", isActive && "bg-black/5")}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
