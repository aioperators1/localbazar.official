import { getAdminBanners } from "@/lib/actions/admin";
import BannersClient from "./BannersClient";

export default async function BannersPage() {
    const banners = await getAdminBanners();

    return <BannersClient initialBanners={banners} />;
}
