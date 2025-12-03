import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_request: NextRequest) {
  // Note: Since we're using localStorage (client-side only), we can't check tokens here
  // Token validation will happen on the client-side through Redux and protected components
  // This middleware just allows all requests to pass through

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-otp",
  ],
};
