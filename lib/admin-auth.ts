import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

export async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    return await verifyJWT(token);
  } catch (err) {
    return null;
  }
}
