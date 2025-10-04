import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import customTheme from "@/utils/theme/custom-theme";
import "../utils/i18n";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/app/components/shadcn-ui/Default-Ui/toaster";
import { CustomizerContextProvider } from "./context/CustomizerContext";
import { AuthProvider } from "./context/AuthContext";
import { PermissionProvider } from "./context/PermissionContext";
import { WebSocketProvider } from "./context/WebSocketContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeltaYards users",
  description: "DeltaYards users",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <ThemeModeScript />
      </head>
      <body className={`${inter.className}`}>
        <Flowbite theme={{ theme: customTheme }}>
          <AuthProvider>
            <PermissionProvider>
              <WebSocketProvider>
                <CustomizerContextProvider>
                  <NextTopLoader color="var(--color-primary)" />
                  {children}
                </CustomizerContextProvider>
              </WebSocketProvider>
            </PermissionProvider>
          </AuthProvider>
        </Flowbite>
        <Toaster />
      </body>
    </html>
  );
}
