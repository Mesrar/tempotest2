import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "../supabase/middleware";

export const locales = ["en", "ar", "fr"];
export const defaultLocale = "en";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip internationalization for static files and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return await updateSession(req);
  }

  // Check if the pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    // Get the preferred locale from cookie, localStorage, or accept-language header
    // localStorage is not accessible in middleware, but we can check cookies
    let locale = req.cookies.get("preferredLocale")?.value || 
                 req.cookies.get("NEXT_LOCALE")?.value || 
                 defaultLocale;

    if (!locale || !locales.includes(locale as any)) {
      const acceptLanguage = req.headers.get("accept-language");
      if (acceptLanguage) {
        // Parse the accept-language header to get the preferred locale
        locale =
          acceptLanguage
            .split(",")
            .map((lang) => lang.split(";")[0].trim().substring(0, 2))
            .find((lang) => locales.includes(lang as any)) || defaultLocale;
      } else {
        locale = defaultLocale;
      }
    }

    // Redirect to the locale-prefixed path
    const newUrl = new URL(
      `/${locale}${pathname === "/" ? "" : pathname}`,
      req.url,
    );
    const response = NextResponse.redirect(newUrl);
    
    // Set the cookie for future requests
    response.cookies.set("preferredLocale", locale, { 
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    
    return response;
  }

  // For paths with locale, update the Supabase auth session
  return await updateSession(req);
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/polar/webhook (webhook endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/payments/webhook).*)",
  ],
};
