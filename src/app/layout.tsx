import type { Metadata } from "next";
import "./globals.css";
import { playfairDisplay, poppins } from "@/lib/font";
import ApplicationContextProvider from "@/providers/application-context-provider";
import ConvexClientProvider from "@/providers/convex-client-provider";

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
        <ConvexClientProvider>
          <ApplicationContextProvider>{children}</ApplicationContextProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
