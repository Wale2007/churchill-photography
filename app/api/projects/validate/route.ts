import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Passcode is required" }, { status: 400 });
    }

    // Lookup project by passcode
    let project = await prisma.project.findFirst({
      where: { password: password },
    });

    // Backward compatibility check for any legacy encrypted passcodes in database
    if (!project) {
      const allProjects = await prisma.project.findMany();
      for (const p of allProjects) {
        try {
          // If the password field stores a bcrypt hash (starts with $2), verify it
          if (p.password.startsWith("$2") && bcrypt.compareSync(password, p.password)) {
            project = p;
            break;
          }
        } catch (e) {
          // ignore parsing issues
        }
      }
    }

    if (!project) {
      return NextResponse.json({ error: "Invalid passcode. Please check and try again." }, { status: 404 });
    }

    // Check expiry
    if (new Date() > new Date(project.expiryDate)) {
      return NextResponse.json({ error: "This delivery link has expired" }, { status: 410 });
    }

    // Update analytics (Increment download count on login/access)
    const analytics = await prisma.downloadAnalytic.findFirst({
      where: { projectId: project.id },
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
          projectId: project.id,
          downloadCount: 1,
          lastAccessTime: new Date(),
        },
      });
    }

    // Return project files (except password)
    const { password: _, ...safeProject } = project;
    return NextResponse.json({ success: true, project: safeProject });
  } catch (error: any) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
