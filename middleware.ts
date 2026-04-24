import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const pathname = request.nextUrl.pathname;

    console.log("🔥 MIDDLEWARE HIT:", request.nextUrl.pathname);

    if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    try {
        const { payload } = await jwtVerify(token, secret);

        if (pathname.startsWith("/admin") && payload.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/profile/:path*", "/cart/:path*", "/orders/:path*"],
};