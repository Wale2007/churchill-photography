import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary if credentials exist
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query: any = {};
    if (category && category !== "All") {
      query.category = category;
    }

    const portfolioItems = await prisma.portfolio.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(portfolioItems);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch portfolio: " + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const featured = formData.get("featured") === "true";
    
    // Support multiple files under "image" key
    const imageFiles = formData.getAll("image") as File[];

    if (!title || !category || imageFiles.length === 0) {
      return NextResponse.json({ error: "Title, category, and at least one image are required" }, { status: 400 });
    }

    const createdItems = [];

    // Loop through each uploaded file to handle bulk uploads
    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      
      // Convert file to buffer
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      let imageUrl = "";

      if (useCloudinary) {
        // Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "churchill_portfolio" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        imageUrl = uploadResult.secure_url;
      } else {
        // Local development fallback - Save inside public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const fileName = `${Date.now()}_${i}_${imageFile.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        
        imageUrl = `/uploads/${fileName}`;
      }

      // Generate a clean title for bulk items (e.g. "Sunset Shoot" or "Sunset Shoot - Part 2")
      const finalTitle = imageFiles.length > 1 ? `${title} - Part ${i + 1}` : title;

      const newItem = await prisma.portfolio.create({
        data: {
          title: finalTitle,
          description,
          category,
          featured: i === 0 ? featured : false, // Only set first item as featured if featured was toggled
          imageUrl,
        },
      });
      createdItems.push(newItem);
    }

    return NextResponse.json({ success: true, items: createdItems });
  } catch (error: any) {
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
