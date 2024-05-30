import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../global.css";
import { PsbtContextProvider } from "../contexts/PsbtContext";
import Footer from "../components/Footer";
import { KeyContextProvider } from "../contexts/KeyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PSBT Builder",
  description: "EAST PSBT Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html className="bg-[#0F111B]" lang="en">
      <body className={inter.className}>
        <KeyContextProvider>
          <PsbtContextProvider>{children}</PsbtContextProvider>
        </KeyContextProvider>
      </body>
    </html>
  );
}
