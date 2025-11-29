import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandMenu } from "@/components/ui/command-menu";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "LatentX - Premium Freelancing Platform",
  description: "Connect with top talent and find your next gig.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 text-gray-900`}
      >
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <CommandMenu />
        <Toaster />
      </body>
    </html>
  );
}
