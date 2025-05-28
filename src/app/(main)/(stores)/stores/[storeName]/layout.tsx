import { AppSidebar } from "./_components/(store-admin-dashboard)/app-sidebar";
import { SiteHeader } from "./_components/(store-admin-dashboard)/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function StoreNameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
