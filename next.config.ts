import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/auth/:path*",
                destination: "https://bookstore-backend-2-dba4.onrender.com/auth/:path*",
            },
            {
                source: "/auth",
                destination: "https://bookstore-backend-2-dba4.onrender.com/auth",
            },
        ];
    },
};

export default nextConfig;