import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Issue the cookie when input the password
function hmac(key: string, data: string): string {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

export async function POST(request: NextRequest) {
  // 1. Get secret from env and compare it with provided psw
  const { password } = await request.json();

  const secret = process.env.SESSION_SECRET!;
  const expected = hmac(secret, process.env.SITE_PASSWORD!);
  const provided = hmac(secret, password ?? "");

  const match = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(provided),
  );

  if (!match) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // 2. Set Sessiion cookie(HTTP-ONLY, so js can't read it)
  const sessionToken = hmac(secret, "authenticated");
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
  });

  return response;
}
