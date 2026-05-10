import {NextRequest, NextResponse} from "next/server";
import {jwtDecode} from "jwt-decode";

type JwtPayload = {
    role: string;
};

export function proxy(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    // console.log("Token", token);

    const pathname = req.nextUrl.pathname;

    const protectedRoutes = [
        "/admin",
        "/seller",
        "/profile",
        "/orders",
        "/wishlist",
    ];

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // Not logged in
    if (!token) {
        return NextResponse.redirect(
            new URL("/auth/signin", req.url)
        );
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        // console.log("Decoded:", decoded);

        // Admin only
        if (
            pathname.startsWith("/admin") &&
            decoded.role !== "admin"
        ) {
            return NextResponse.redirect(
                new URL("/", req.url)
            );
        }

        // Seller only
        if (
            pathname.startsWith("/seller") &&
            decoded.role !== "seller"
        ) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    } catch {
        return NextResponse.redirect(
            new URL("/auth/signin", req.url)
        );
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/seller/:path*",
        "/profile/:path*",
        "/orders/:path*",
        "/wishlist/:path*",
    ],
};