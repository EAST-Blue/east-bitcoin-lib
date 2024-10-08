import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RegNet Faucet by Eastlayer",
  description: "Get rBTC and start testing with RegNet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-main-0 min-h-screen">{children}</body>
    </html>
  );
}
