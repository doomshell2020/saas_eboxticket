// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get("authToken")?.value;
  const userToken = request.cookies.get("userAuthToken")?.value;

  // -------------------
  // CORS Handling
  // -------------------
  const response = NextResponse.next();

  // Allow from all origins (or replace * with specific domain)
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Preflight (OPTIONS request)
  if (request.method == "OPTIONS") {
    return response;
  }

  // -------------------
  // LOGIN PAGE OPEN
  // -------------------
  if (pathname == "/login") {
    return response;
  }

  // -------------------
  // ADMIN ROUTE PROTECT
  // -------------------
  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/auth")) {
      return response;
    }

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
  }

  // -------------------
  // USER ROUTE PROTECT
  // -------------------
  const userProtectedRoutes = ["/profile", "/dashboard", "/orders"];
  if (userProtectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*", // ✅ Apply to all APIs
    "/admin/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/orders/:path*",
  ],
};
