import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "BoardMaster - Modern Project Management",
    template: "%s | BoardMaster",
  },
  description:
    "A modern Trello-like task management application for teams and individuals.",
  keywords: [
    "project management",
    "task management",
    "kanban",
    "team collaboration",
  ],
  authors: [{ name: "BoardMaster Team" }],
  creator: "BoardMaster",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://boardmaster.app",
    siteName: "BoardMaster",
    title: "BoardMaster - Modern Project Management",
    description:
      "A modern Trello-like task management application for teams and individuals.",
    images: [
      {
        url: "https://boardmaster.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "BoardMaster",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoardMaster - Modern Project Management",
    description:
      "A modern Trello-like task management application for teams and individuals.",
    images: ["https://boardmaster.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
