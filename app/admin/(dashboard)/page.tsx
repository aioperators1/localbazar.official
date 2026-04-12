import { getDashboardStats, getMonthlyRevenue } from "@/lib/actions/admin";
import DashboardClient from "@/components/admin/DashboardClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    
    // Safety check just in case, layout usually catches this
    if (!session || !session.user) {
        redirect("/admin/login");
    }

    const role = (session.user as any).role || "ADMIN";
    const permissions = (session.user as any).permissions || "";
    // Parse permissions robustly
    let permissionList: any[] = [];
    try {
        permissionList = typeof permissions === 'string' && permissions.startsWith('[')
            ? JSON.parse(permissions)
            : Array.isArray(permissions) ? permissions : [];
    } catch (e) {
        permissionList = [];
    }

    const hasDashboard = role === "SUPER_ADMIN" || permissionList.some((p: any) => p.id === "dashboard");

    // If they are not SUPER_ADMIN and don't explicitly have dashboard access, auto-redirect them
    // to their first available department.
    if (!hasDashboard) {
        // Fallback array for redirection map matching AddMemberModal PAGES IDs
        const possiblePages = ["orders", "products", "categories", "customers", "banners", "vouchers", "brands", "logo", "team", "settings"];
        
        let target = "/admin"; // Default fallback (which would just be an empty sidebar here naturally)
        for (const p of possiblePages) {
            if (permissionList.some((perm: any) => perm.id === p)) {
                target = `/admin/${p}`;
                break;
            }
        }
        
        // Final sanity check so we don't redirect to /admin infinitely if they have 0 permissions
        if (target !== "/admin") {
            redirect(target);
        }
    }

    const statsData = await getDashboardStats();
    const monthlyRevenue = await getMonthlyRevenue();

    return <DashboardClient statsData={statsData} monthlyRevenue={monthlyRevenue} />;
}
