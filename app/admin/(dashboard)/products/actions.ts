
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const stock = parseInt(formData.get("stock") as string);
    const images = formData.get("images") as string;
    const featured = formData.get("featured") === "on";

    const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();

    await prisma.product.create({
        data: {
            name,
            slug,
            description,
            price,
            stock,
            images,
            categoryId,
            featured
        }
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    redirect("/admin/products");
}
