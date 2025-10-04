import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antipode Explorer - Discover Your Opposite Point on Earth",
  description:
    "Explore the exact opposite point on Earth from any location. Interactive maps, real-time calculations, and fascinating geographic insights. Drag and discover antipodes around the globe.",
  keywords: [
    "antipode",
    "geography",
    "earth",
    "coordinates",
    "maps",
    "interactive",
    "globe",
  ],
  authors: [{ name: "Antipode Explorer" }],
  openGraph: {
    title: "Antipode Explorer",
    description:
      "Discover the exact opposite point on Earth from your location",
    type: "website",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
