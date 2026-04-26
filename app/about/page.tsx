import { getAdminSettings } from "@/lib/actions/admin";
import { LegalPageClient } from "@/components/store/LegalPageClient";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const settings = await getAdminSettings();
    return <LegalPageClient title="Our Story" titleAr="قصتنا" contentKey="page_about" settings={settings} />;
}
