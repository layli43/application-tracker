import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

//Compare the cookie with password
export function proxy(request: NextRequest) {
  const secret = process.env.SESSION_SECRET!;
  const expected = crypto
    .createHmac("sha256", secret)
    .update("authenticated")
    .digest("hex");
 const cookieValue = request.cookies.get("session")?.value;

 if(!cookieValue || cookieValue.length !== expected.length) {
    return NextResponse.redirect(new URL("/login", request.url))
 }
}
