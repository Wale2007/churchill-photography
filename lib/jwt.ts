const encoder = new TextEncoder();
const JWT_SECRET = process.env.JWT_SECRET || "churchill-photography-secret-key-123456";

async function getCryptoKey() {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

export async function signJWT(payload: any): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 })); // 24h
  
  const tokenData = `${encodedHeader}.${encodedPayload}`;
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(tokenData));
  
  const sigArray = Array.from(new Uint8Array(signature));
  const sigString = String.fromCharCode(...sigArray);
  const encodedSignature = base64UrlEncode(sigString);
    
  return `${tokenData}.${encodedSignature}`;
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    
    const tokenData = `${header}.${payload}`;
    const key = await getCryptoKey();
    
    const sigString = base64UrlDecode(signature);
    const sigBytes = new Uint8Array(sigString.split("").map((c) => c.charCodeAt(0)));
    
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(tokenData));
    if (!isValid) return null;
    
    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    if (decodedPayload.exp && Date.now() / 1000 > decodedPayload.exp) {
      return null; // Expired
    }
    
    return decodedPayload;
  } catch (err) {
    return null;
  }
}
