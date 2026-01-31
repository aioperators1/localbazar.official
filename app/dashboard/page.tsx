import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        // If logged in, go to the actual admin dashboard
        redirect("/admin");
    } else {
        // If not logged in, go to login page
        redirect("/admin/login");
    }
}
