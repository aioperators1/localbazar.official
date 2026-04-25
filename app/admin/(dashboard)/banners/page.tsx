import { getAdminBanners } from "@/lib/actions/admin";
import BannersClient from "./BannersClient";

export const dynamic = 'force-dynamic';

export default async function BannersPage() {
    const banners = await getAdminBanners();

    return <BannersClient initialBanners={banners} />;
}
