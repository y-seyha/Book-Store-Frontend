import { cn } from "@/lib/utils";
import Link from "next/link";

export function Breadcrumb({ children }: { children: React.ReactNode }) {
    return (
        <nav className="flex text-sm text-muted-foreground">
            <ol className="flex items-center space-x-2">{children}</ol>
        </nav>
    );
}

export function BreadcrumbItem({
                                   children,
                                   href,
                                   isLast,
                               }: {
    children: React.ReactNode;
    href?: string;
    isLast?: boolean;
}) {
    return (
        <li className="flex items-center space-x-2">
            {href && !isLast ? (
                <Link
                    href={href}
                    className="hover:text-foreground transition-colors"
                >
                    {children}
                </Link>
            ) : (
                <span className={cn(isLast && "text-foreground font-medium")}>
          {children}
        </span>
            )}

            {!isLast && <span className="text-muted-foreground">/</span>}
        </li>
    );
}