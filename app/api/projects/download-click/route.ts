import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const analytics = await prisma.downloadAnalytic.findFirst({
      where: { projectId },
    });

    if (analytics) {
      await prisma.downloadAnalytic.update({
        where: { id: analytics.id },
        data: {
          downloadCount: { increment: 1 },
          lastAccessTime: new Date(),
        },
      });
    } else {
      await prisma.downloadAnalytic.create({
        data: {
          projectId,
          downloadCount: 1,
          lastAccessTime: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
