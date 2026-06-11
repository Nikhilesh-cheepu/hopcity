import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Hopcity Brew Co. | Coming Soon",
  description:
    "The World in Your Glass. Hopcity Brew Co. — a world-class brewery experience coming to Sarath City Capital Mall, Hyderabad.",
  openGraph: {
    title: "Hopcity Brew Co. | Coming Soon",
    description: "Find your world at Hopcity. The World in Your Glass.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} h-full`}>
      <body className="grain min-h-full antialiased">{children}</body>
    </html>
  );
}
