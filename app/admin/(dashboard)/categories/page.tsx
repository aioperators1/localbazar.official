import { getAdminCategories } from "@/lib/actions/admin";
import { CategoryList } from "@/components/admin/CategoryList";

export const dynamic = 'force-dynamic';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppSession } from "@/lib/types";

export default async function AdminCategoriesPage() {
    const categories = await getAdminCategories();
    const session = await getServerSession(authOptions) as AppSession | null;

    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
    const canEdit = isSuperAdmin || session?.user?.permissions?.some((p: any) => p.id === 'categories' && p.access === 'editor');

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Collections</h1>
                    <p className="text-[13px] text-gray-500">Curate and organize your boutique's master hierarchy.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canEdit && (
                        <Button asChild className="h-10 bg-black text-white hover:bg-[#333] px-6 rounded-lg text-[12px] font-semibold uppercase tracking-wider shadow-sm">
                            <Link href="/admin/categories/new" className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add collection
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 lg:p-8">
                <CategoryList categories={categories} />
            </div>
        </div>
    );
}
