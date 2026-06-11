import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hopcity Brew Co. | Coming Soon",
  description:
    "The World in Your Glass. Hopcity Brew Co. — a world-class brewery experience coming to Sarath City Capital Mall, Hyderabad.",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand/favicon.png",
    shortcut: "/brand/favicon-32.png",
  },
  openGraph: {
    title: "Hopcity Brew Co. | Coming Soon",
    description: "Find your world at Hopcity. The World in Your Glass.",
    type: "website",
    images: ["/brand/hopcity-logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="grain min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
