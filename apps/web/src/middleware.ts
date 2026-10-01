import { NextRequest, NextResponse } from "next/server";

/**
 * Permissive CORS for /api/* only. Native (iOS/Android) callers never hit
 * CORS, but the Expo *web* preview does — this keeps that path working too.
 * Every route already authenticates via a Bearer token, not cookies, so a
 * wide-open origin doesn't expose session state to other sites.
 */
export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return withCors(new NextResponse(null, { status: 204 }));
  }
  return withCors(NextResponse.next());
}

function withCors(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
