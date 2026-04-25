import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (e: any) {
            // Already exists
        }

        // Generate unique filename
        const ext = path.extname(file.name);
        const filename = `${crypto.randomUUID()}${ext}`;
        const filePath = path.join(uploadsDir, filename);

        await writeFile(filePath, buffer);

        const url = `/uploads/${filename}`;

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
