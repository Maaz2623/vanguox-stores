import { NextResponse, NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession(req);
  const pathname = req.nextUrl.pathname;

  // Check protected routes (optional, based on your needs)
  const isProtected =
    pathname.startsWith("/") || pathname.startsWith("/stores");
  if (isProtected && !session?.user) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect if path matches /stores/:store/shop exactly
  const pathSegments = pathname.split("/").filter(Boolean); // ['stores', 'tsf', 'shop']
  if (
    pathSegments.length === 3 &&
    pathSegments[0] === "stores" &&
    pathSegments[2] === "shop"
  ) {
    const storeName = pathSegments[1]; // 'tsf'
    const subdomainUrl = new URL(req.url);
    subdomainUrl.hostname = `${storeName}.vanguox.com`;
    subdomainUrl.pathname = "/"; // Redirect to root of subdomain
    return NextResponse.redirect(subdomainUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/stores/:path*"],
};
