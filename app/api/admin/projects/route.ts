import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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

export async function GET() {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { analytics: true },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch projects: " + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const clientName = formData.get("clientName") as string;
    const projectName = formData.get("projectName") as string;
    const passcode = formData.get("passcode") as string;
    const expiryDays = formData.get("expiryDays") as string;
    const downloadUrlField = formData.get("downloadUrl") as string;
    const deliverableFile = formData.get("file") as File | null;

    if (!clientName || !projectName || !passcode || !expiryDays) {
      return NextResponse.json({ error: "Client name, project name, passcode, and expiry days are required" }, { status: 400 });
    }

    let finalDownloadUrl = downloadUrlField || "";

    // If a file was uploaded directly on the admin page, process it
    if (deliverableFile && deliverableFile.size > 0) {
      const bytes = await deliverableFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (useCloudinary) {
        // Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: "churchill_deliveries",
              resource_type: "auto" // Auto-detect ZIP, images, PDFs, etc.
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });
        finalDownloadUrl = uploadResult.secure_url;
      } else {
        // Local development fallback - Save inside public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const fileName = `${Date.now()}_${deliverableFile.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        
        finalDownloadUrl = `/uploads/${fileName}`;
      }
    }

    if (!finalDownloadUrl) {
      return NextResponse.json({ error: "Please either upload a deliverable file or paste a download link" }, { status: 400 });
    }

    // Save passcode directly for direct client passcode-only lookup
    const password = passcode;

    // Generate unique secure token
    const generatedToken = crypto.randomBytes(32).toString("hex");

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));

    const name = clientName;
    const description = projectName;

    // Build the files JSON payload as expected by downloads/page.tsx
    const filesArray = [
      {
        name: deliverableFile ? deliverableFile.name : "VIP Deliverables Archive",
        url: finalDownloadUrl,
        size: deliverableFile 
          ? `${(deliverableFile.size / (1024 * 1024)).toFixed(2)} MB`
          : "High-Res Archive ZIP",
      },
    ];

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        password,
        generatedToken,
        expiryDate,
        files: filesArray,
      },
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create project: " + error.message }, { status: 500 });
  }
}
