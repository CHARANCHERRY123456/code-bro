import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


const secret = process.env.NEXTAUTH_SECRET || "my_super_secret_key_123";

export async function middleware(req) {
  const sessionData = await getToken({ req, secret });
  
  const { pathname } = req.nextUrl;

  if (sessionData && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!sessionData && (pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/projects"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/projects/:path*"],
};
