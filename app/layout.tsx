import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Churchill Concept Photography | Elegant & Professional",
  description: "High-end lifestyle, wedding, and corporate photography services by Churchill Concept. Book your luxury shoot today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-brand-cream text-brand-charcoal antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
