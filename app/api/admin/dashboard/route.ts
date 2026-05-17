import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET() {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    // 1. Total Active Projects (Expiry date in the future)
    const activeProjects = await prisma.project.count({
      where: {
        expiryDate: {
          gt: new Date(),
        },
      },
    });

    // 2. Total Downloads (Sum of all DownloadAnalytic downloadCounts)
    const downloadAnalytics = await prisma.downloadAnalytic.aggregate({
      _sum: {
        downloadCount: true,
      },
    });
    const totalDownloads = downloadAnalytics._sum.downloadCount || 0;

    // 3. Unread Messages count
    const unreadMessages = await prisma.contactMessage.count({
      where: { isRead: false },
    });

    // 4. Total Portfolio Assets
    const totalPortfolio = await prisma.portfolio.count();

    // 5. Fetch recent messages
    const recentMessages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      activeProjects,
      totalDownloads,
      unreadMessages,
      totalPortfolio,
      recentMessages,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load dashboard stats: " + error.message }, { status: 500 });
  }
}
