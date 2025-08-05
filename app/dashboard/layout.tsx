import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
