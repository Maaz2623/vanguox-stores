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
import {
  BadgePercentIcon,
  IdCardIcon,
  Package2Icon,
  PackageIcon,
} from "lucide-react";
import { CreateStoreDialog } from "@/app/(main)/_components/create-store-dialog";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({ storeName }: { storeName: string }) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const commerce = [
    {
      title: "Orders",
      url: `/stores/${storeName}/orders`,
      icon: Package2Icon,
    },
    {
      title: "Coupons",
      url: `/stores/${storeName}/coupons`,
      icon: BadgePercentIcon,
    },
    {
      title: "Memberships",
      url: `/stores/${storeName}/memberships`,
      icon: IdCardIcon,
    },
  ];

  const analytics = [
    {
      title: "Overview",
      url: `/stores/${storeName}`,
      icon: IconDashboard,
    },
  ];

  const inventory = [
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
        <SidebarGroupLabel>Analytics</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {analytics.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={cn("", isActive && "bg-black/5")}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Manage Commerce</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {commerce.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={cn("", isActive && "bg-black/5")}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Inventory</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            {inventory.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={cn("", isActive && "bg-black/5")}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
