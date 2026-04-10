import type { Metadata } from "next";
import { Roboto, Roboto_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import {AuthProvider} from "@/context/AuthContext";
import {Toaster} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {CartProvider} from "@/context/CartContext";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
          <html
              lang="en"
              className={`${roboto.variable} ${robotoMono.variable}`}
              suppressHydrationWarning
          >
        <head />
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >

           <TooltipProvider>
               <AuthProvider>
                   <CartProvider>
                   {children}
                   <Toaster    position="bottom-right" />
                   </CartProvider>
               </AuthProvider>
           </TooltipProvider>
        </ThemeProvider>
        </body>
        </html>
      </>
  );
}
