import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: `${profile.personal_info.name} | Portfolio`,
  description: profile.summary,
  openGraph: {
    title: `${profile.personal_info.name} | Portfolio`,
    description: profile.summary,
    type: "website"
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }]
  },
  manifest: "/favicon/site.webmanifest"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
