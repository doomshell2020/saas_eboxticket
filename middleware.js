// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('authToken')?.value;
  const userToken = request.cookies.get('userAuthToken')?.value;


  // 🌐 Log every incoming request
  // console.log("➡️ Incoming Request:", {
  //   method: request.method,
  //   url: request.url,
  //   pathname,
  //   adminToken: adminToken ? "present" : "missing",
  //   userToken: userToken ? "present" : "missing"
  // });

  // ✅ Allow user login page without redirect
  if (pathname == '/login') {
    return NextResponse.next();
  }

  // -------------------
  // ADMIN ROUTE PROTECT
  // -------------------
  if (pathname.startsWith('/admin')) {
    // ✅ Skip token check for login/auth pages
    if (pathname.startsWith('/admin/auth')) {
      return NextResponse.next();
    }

    // ✅ Redirect if no token
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/auth', request.url));
    }
  }


  // -------------------
  // USER ROUTE PROTECT
  // -------------------
  const userProtectedRoutes = ['/profile', '/dashboard', '/orders'];
  if (userProtectedRoutes.some(route => pathname.startsWith(route))) {
    if (!userToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/orders/:path*'
  ],
};
