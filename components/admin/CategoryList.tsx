"use client";

import { Pencil, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminCategory {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    parent?: { name: string, nameAr?: string | null } | null;
    _count: { products: number };
    showInHomeTabs: boolean;
    showInHomeCurated: boolean;
}

import { usePermissions } from "@/hooks/use-permissions";
import { motion } from "framer-motion";

export function CategoryList({ categories }: { categories: AdminCategory[] }) {
    const { canEdit } = usePermissions();
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!canEdit('categories')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        if (!confirm("Terminate this collection entity?")) return;

        const res = await deleteCategory(id);
        if (res.success) {
            toast.success("COLLECTION TERMINATED");
            router.refresh();
        } else {
            toast.error("TRANSFORMATION FAILED");
        }
    };

    return (
        <div className="overflow-hidden w-full glass-table rounded-[32px] border-white/5 shadow-2xl overflow-x-auto">
            <table className="w-full text-left text-[12px] border-collapse min-w-[700px]">
                <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr>
                        <th className="py-8 px-4 pl-8 pro-label">Collection Entity</th>
                        <th className="py-8 px-4 pro-label">Slug Index</th>
                        <th className="py-8 px-4 pro-label">Hierarchy</th>
                        <th className="py-8 px-4 pro-label">Inventory Count</th>
                        <th className="py-8 px-4 pro-label">Operational Status</th>
                        <th className="py-8 px-4 text-right pr-8 pro-label">Operations</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#0F1113]/5">
                    {categories.map((cat, idx) => (
                        <motion.tr 
                            key={cat.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group hover:bg-white/[0.03] transition-all duration-300"
                        >
                             <td className="py-6 px-4 pl-8">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-white text-[14px] tracking-tight group-hover:text-blue-400 transition-colors italic uppercase">{cat.name}</span>
                                        {cat.nameAr && (
                                            <span className="font-sans font-bold text-white text-[14px] opacity-40 italic" dir="rtl">{cat.nameAr}</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.1em]">ID_{cat.id.slice(-6).toUpperCase()}</span>
                                </div>
                            </td>
                            <td className="py-6 px-4">
                                <code className="text-white font-black bg-white/5 px-2 py-1 rounded-lg border border-white/5 text-[11px] group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                                    /{cat.slug}
                                </code>
                            </td>
                             <td className="py-6 px-4">
                                {cat.parent ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2" />
                                        {cat.parent.name}
                                    </span>
                                ) : (
                                    <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] italic">Master Node</span>
                                )}
                            </td>
                            <td className="py-6 px-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-black text-[14px] tracking-tighter">{cat._count.products}</span>
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active Units</span>
                                </div>
                            </td>
                            <td className="py-6 px-4">
                                <div className="flex flex-wrap gap-2">
                                    {cat.showInHomeTabs ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                                            TAB_CORE
                                        </span>
                                    ) : null}
                                    {cat.showInHomeCurated ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] bg-white text-black border border-white shadow-md">
                                            GRID_PRIORITY
                                        </span>
                                    ) : null}
                                    {!cat.showInHomeTabs && !cat.showInHomeCurated && (
                                        <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] italic">Internal_Only</span>
                                    )}
                                </div>
                            </td>
                             <td className="py-6 px-4 pr-8 text-right">
                                {canEdit('categories') && (
                                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <Button variant="ghost" size="icon" asChild className="h-10 w-10 text-white hover:bg-white hover:text-black hover:shadow-xl rounded-[14px] transition-all active:scale-90 border border-transparent hover:border-white/20">
                                            <Link href={`/admin/categories/${cat.id}`}>
                                                <Pencil className="w-[16px] h-[16px]" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(cat.id)}
                                            className="h-10 w-10 text-rose-500 hover:text-white hover:bg-rose-600 rounded-[14px] transition-all active:scale-90 border border-transparent hover:border-rose-600 shadow-rose-900/20"
                                        >
                                            <Trash className="w-[16px] h-[16px]" />
                                        </Button>
                                    </div>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-32 text-center">
                                <div className="p-12 text-center">
                                    <p className="text-white font-black uppercase tracking-[0.2em] text-[13px]">Collection Pool Empty</p>
                                    <p className="text-white/40 text-[11px] mt-2 font-bold uppercase tracking-widest">Awaiting initialization...</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
