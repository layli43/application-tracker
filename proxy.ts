//1. Get content from cookie
// and check if it is "Authenticated"

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export function proxy(request: NextRequest) {
  const secret = process.env.SESSION_SECRET!;
  const expected = crypto
    .createHmac("sha256", secret)
    .update("authenticated")
    .digest("hex");

  const cookieValue = request.cookies.get("session")?.value;

  if (!cookieValue || cookieValue.length !== expected.length) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const match = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(cookieValue),
  );

  if (!match) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
}
