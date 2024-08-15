import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Config Page | Satsforge",
  description: "Satsforge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html className="bg-[#0F111B]" lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
