import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession(req);
  const url = req.nextUrl;
  const pathname = url.pathname;
  const host = req.headers.get("host") || "";

  const isSubdomain = host.split(".").length > 2 && !host.includes("localhost");
  const baseDomain = "vanguox.com";

  // 🔐 Protect routes
  const isProtected = pathname === "/" || pathname.startsWith("/stores");
  if (isProtected && !session?.user) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 🔁 If you're on a subdomain and trying to access /stores/* or root, redirect to vanguox.com
  if (isSubdomain && (pathname === "/" || pathname.startsWith("/stores"))) {
    const rootUrl = new URL(req.url);
    rootUrl.hostname = baseDomain;
    return NextResponse.redirect(rootUrl);
  }

  // 🔁 If you're on vanguox.com and accessing /stores/:store/shop, redirect to :store.vanguox.com
  const segments = pathname.split("/").filter(Boolean); // ['stores', 'tsf', 'shop']
  if (
    !isSubdomain &&
    segments.length === 3 &&
    segments[0] === "stores" &&
    segments[2] === "shop"
  ) {
    const store = segments[1];
    const subdomainUrl = new URL(req.url);
    subdomainUrl.hostname = `${store}.${baseDomain}`;
    subdomainUrl.pathname = "/"; // or preserve `/shop` if needed
    return NextResponse.redirect(subdomainUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/stores/:path*"],
};
