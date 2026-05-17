import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Exclude the login page
    if (pathname === "/admin/login") {
      if (token) {
        const decoded = await verifyJWT(token);
        if (decoded) {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
      }
      return NextResponse.next();
    }

    // Require token for other admin routes
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      // Clear invalid cookie
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
