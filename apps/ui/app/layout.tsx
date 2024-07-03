import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { ConfigContextProvider } from "./contexts/ConfigContext";
import { AccountContextProvider } from "./contexts/AccountContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EASTLayer | Transaction",
  description: "EASTLayer Transaction Page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html className="bg-[#0F111B]" lang="en">
      <body className={inter.className}>
        <ConfigContextProvider>
          <AccountContextProvider>{children}</AccountContextProvider>
        </ConfigContextProvider>
      </body>
    </html>
  );
}
