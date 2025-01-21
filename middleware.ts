import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isSignUpPage = request.nextUrl.pathname.startsWith("/signup");

  if (isLoginPage || isSignUpPage) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token?.sub) {
    const response = NextResponse.next();
    response.cookies.set('session-id', token.sub, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 // 1時間
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/protected/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 
