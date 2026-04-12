import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PageTransition } from "@/components/admin/PageTransition";
import { NotificationManager } from "@/components/admin/NotificationManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/admin/login");
    }


    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white relative antialiased selection:bg-white/10 selection:text-white" dir="ltr">
            <NotificationManager />
            <AdminSidebar />
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto bg-[#050505]">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}
