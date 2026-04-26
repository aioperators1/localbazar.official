import { getAdminSettings } from "@/lib/actions/admin";
import { LegalPageClient } from "@/components/store/LegalPageClient";

export const dynamic = 'force-dynamic';

export default async function ShippingPage() {
    const settings = await getAdminSettings();
    return <LegalPageClient title="Shipping Policy" titleAr="سياسة الشحن" contentKey="page_shipping" settings={settings} />;
}
