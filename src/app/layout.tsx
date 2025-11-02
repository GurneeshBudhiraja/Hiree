import type { Metadata } from "next";
import "./globals.css";
import { playfairDisplay, poppins } from "@/lib/font";
import ApplicationContextProvider from "@/providers/application-context-provider";

export const metadata: Metadata = {
  title: "Hiree",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfairDisplay.variable} antialiased dark`}
      >
        <ApplicationContextProvider>{children}</ApplicationContextProvider>
      </body>
    </html>
  );
}
