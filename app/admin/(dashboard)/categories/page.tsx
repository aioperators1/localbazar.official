import { getAdminCategories } from "@/lib/actions/admin";
import { CategoryList } from "@/components/admin/CategoryList";
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
    const canEdit = isSuperAdmin || session?.user?.permissions?.some((p) => p.id === 'categories' && p.access === 'editor');

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Collections</h1>
                    <p className="text-[13px] text-white/40 font-medium uppercase tracking-[0.2em]">Curate and organize your boutique&apos;s master hierarchy.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canEdit && (
                        <Button asChild className="h-10 bg-white text-black hover:bg-white/80 px-6 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-white/5 active:scale-95">
                            <Link href="/admin/categories/new" className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add collection
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="glass-table rounded-[40px] border-white/5 shadow-2xl overflow-hidden p-6 lg:p-10">
                <CategoryList categories={categories} />
            </div>
        </div>
    );
}
