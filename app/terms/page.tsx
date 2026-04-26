import { getAdminSettings } from "@/lib/actions/admin";
import { LegalPageClient } from "@/components/store/LegalPageClient";

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
    const settings = await getAdminSettings();
    return <LegalPageClient title="Terms of Service" titleAr="شروط الخدمة" contentKey="page_terms" settings={settings} />;
}
