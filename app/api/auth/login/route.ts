import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Single static premium access password as requested by the user
    if (password !== "churchillconcept") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT session for the admin
    const token = await signJWT({ userId: "churchill-admin", email: "admin@churchillconcept.com" });

    // Set secure cookie
    const response = NextResponse.json({ success: true });
    
    // Cookie parameters (Secure, HttpOnly, SameSite, Max-Age 24h)
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
