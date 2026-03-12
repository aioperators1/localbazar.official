import { getAdminBrands } from "@/lib/actions/admin";
import BrandsClient from "./BrandsClient";

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
    const brands = await getAdminBrands();

    return <BrandsClient initialBrands={brands} />;
}
