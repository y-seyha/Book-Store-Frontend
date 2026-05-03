import type { Metadata } from "next";
import { Roboto, Roboto_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import AppProviders from "@/components/providers/AppProviders";


const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
    weight: ["100","300","400","500","700","900"], // optional: include needed weights
});

// Roboto Mono (monospace)
const robotoMono = Roboto_Mono({
    variable: "--font-roboto-mono",
    subsets: ["latin"],
    weight: ["400","500","700"], // optional
});

export const metadata: Metadata = {
    title: "BookStore App",
    description: "Your wishlist online bookstore",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`${roboto.variable} ${robotoMono.variable}`}
            suppressHydrationWarning
        >
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AppProviders>
                {children}
            </AppProviders>
        </ThemeProvider>
        </body>
        </html>
    );
}
