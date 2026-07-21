import "./globals.css";
import type { Metadata } from "next";
import { Inter, Unbounded, Sofia_Sans } from "next/font/google";
import { Toaster } from "@/src/components/ui/sonner";
import { AuthProvider } from "@/src/contexts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  weight: ["400", "500", "600", "700"],
});

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  variable: "--font-sofia",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Nexora - Modern Project Management",
    template: "%s | Nexora",
  },
  description:
    "A modern Trello-like task management application for teams and individuals.",
  keywords: [
    "project management",
    "task management",
    "kanban",
    "team collaboration",
  ],
  authors: [{ name: "Nexora Team" }],
  creator: "Nexora Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexora.app",
    siteName: "Nexora",
    title: "Nexora - Modern Project Management",
    description:
      "A modern Trello-like task management application for teams and individuals.",
    images: [
      {
        url: "https://nexora.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nexora",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora - Modern Project Management",
    description:
      "A modern Trello-like task management application for teams and individuals.",
    images: ["https://nexora.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${unbounded.variable} ${sofiaSans.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
