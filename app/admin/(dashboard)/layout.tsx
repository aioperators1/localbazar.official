import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-full overflow-hidden bg-[#F1F1F1] text-[#303030] font-sans text-sm grid grid-cols-[auto,1fr]">
            <AdminSidebar />
            <div className="flex flex-col min-h-0 min-w-0 overflow-hidden h-full">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 pb-32">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
