import { getAdminSettings } from "@/lib/actions/admin";
import { LegalPageClient } from "@/components/store/LegalPageClient";

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
    const settings = await getAdminSettings();
    return <LegalPageClient title="Privacy Policy" titleAr="سياسة الخصوصية" contentKey="page_privacy" settings={settings} />;
}
