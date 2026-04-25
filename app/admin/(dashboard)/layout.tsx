import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PageTransition } from "@/components/admin/PageTransition";
import { NotificationManager } from "@/components/admin/NotificationManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EB_Garamond } from "next/font/google";

export const dynamic = 'force-dynamic';

const ebGaramond = EB_Garamond({ 
    subsets: ["latin"], 
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-garamond" 
});

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
        <div className={`${ebGaramond.className} flex h-screen w-full overflow-hidden bg-gray-50 text-black relative antialiased selection:bg-black selection:text-white`} dir="ltr">
            <NotificationManager />
            <AdminSidebar />
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}
