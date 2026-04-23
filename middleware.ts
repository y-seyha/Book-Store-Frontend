import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    console.log(token, "token");

    if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    console.log("MIDDLEWARE RUNNING");

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile/:path*",    "/cart","/cart/:path*", "/orders/:path*"],
};