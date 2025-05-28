import { AppSidebar } from "./_components/(store-admin-dashboard)/app-sidebar";
import { SiteHeader } from "./_components/(store-admin-dashboard)/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader storeName={storeName} />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
