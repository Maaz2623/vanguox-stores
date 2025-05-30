import { getQueryClient, trpc } from "@/trpc/server";
import { AppSidebar } from "./_components/(store-admin-dashboard)/app-sidebar";
import { SiteHeader } from "./_components/(store-admin-dashboard)/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface LayoutProps {
  params: Promise<{
    storeName: string;
  }>;
  children: React.ReactNode;
}

export default async function StoreNameLayout({
  children,
  params,
}: LayoutProps) {
  const { storeName } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.carts.getCartByStoreName.queryOptions({
      storeName,
    })
  );

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense>
            <SiteHeader storeName={storeName} />
          </Suspense>
        </HydrationBoundary>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
