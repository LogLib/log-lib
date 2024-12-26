import { cn } from "@/lib/utils";

import "@/styles/globals.css";

import Loglib from "@loglib/tracker/react";
import localFont from "next/font/local";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";

const fontSatoshi = localFont({
    src: [
        {
            path: "../../assets/fonts/Satoshi-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../assets/fonts/Satoshi-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../assets/fonts/Satoshi-Bold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../assets/fonts/Satoshi-Black.woff2",
            weight: "900",
            style: "black",
        },
    ],
    variable: "--font-satoshi",
});

const fontHeading = localFont({
    src: "../../assets/fonts/CalSans-SemiBold.woff2",
    variable: "--font-heading",
});

export const metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ["Web Analytics", "Open Source web analytics", "loglib", "loglib analytics"],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: `${siteConfig.url}/og.png`,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        images: [`${siteConfig.url}/og.png`],
        creator: "@logib_io",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="shortcut icon" href="/images/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
            </head>
            <body
                className={cn(
                    " bg-gradient-to-tr from-white to-gray-100 font-sans antialiased dark:from-stone-950 via-black dark:to-stone-950/30 transition-all duration-300",
                    fontSatoshi.variable,
                    fontHeading.variable,
                )}
            >
                <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
                    {children}
                    <Loglib
                        config={{
                            id: "loglib",
                            consent: "granted",
                            env: "prod",
                        }}
                    />
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
