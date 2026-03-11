import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden" style={{ background: '#F1F1F1', color: '#303030' }}>
            <AdminSidebar />
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden" style={{ background: '#F1F1F1' }}>
                <AdminHeader />
                <main className="flex-1 overflow-y-auto" style={{ background: '#F1F1F1' }}>
                    <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 pb-32">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
