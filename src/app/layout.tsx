import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const marathi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-marathi",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pune.Bol",
  description: "A Puneri Way AI Talks in Marathi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${marathi.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
