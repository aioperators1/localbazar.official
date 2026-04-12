import { useSession } from "next-auth/react";
import { PagePermission } from "@/types/next-auth";

export function usePermissions() {
    const { data: session } = useSession();
    const userRole = session?.user?.role || "USER";
    const userPermissions: PagePermission[] = session?.user?.permissions || [];

    const isSuperAdmin = userRole === "SUPER_ADMIN";

    const canView = (pageId: string) => {
        if (isSuperAdmin) return true;
        return userPermissions.some(p => p.id === pageId);
    };

    const canEdit = (pageId: string) => {
        if (isSuperAdmin) return true;
        const permission = userPermissions.find(p => p.id === pageId);
        return permission?.access === 'editor';
    };

    return {
        canView,
        canEdit,
        isSuperAdmin,
        permissions: userPermissions,
        role: userRole
    };
}
