import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const analytics = await prisma.downloadAnalytic.findMany({
      orderBy: { lastAccessTime: "desc" },
      include: {
        project: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(analytics);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch analytics: " + error.message }, { status: 500 });
  }
}
