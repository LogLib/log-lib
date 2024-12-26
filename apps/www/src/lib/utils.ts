import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import axios from "axios";
import { Metadata } from "next";
import { env } from "../../env.mjs";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function absoluteUrl(path: string) {
    return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function constructMetadata({
    title = "Loglib -  Privacy first open source beautiful web analytics.",
    description = "Loglib is privacy first open source web analytics you can self host or use our cloud service.",
    image = "https://loglib.io/og.png",
}: {
    title?: string;
    description?: string;
    image?: string;
}): Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@loglib_io",
        },
        icons: "/favicon.ico",
        metadataBase: new URL("https://loglib.io"),
        themeColor: "#000",
    };
}

export function nFormatter(num?: number, digits?: number) {
    if (!num) return "0";
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol : "0";
}

export function nCommaFormat(num?: number) {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const truncate = (str: string | null, length: number) => {
    if (!str || str.length <= length) return str;
    return `${str.slice(0, length - 3)}...`;
};

export const getHost = (url: string) => {
    return new URL(url).hostname.match(/[^.]+\.[^.]+$/)?.[0];
};

export function isURLImage(url: string, callback: (state: boolean) => void) {
    const img = new Image();
    img.onload = function () {
        callback(true);
    };
    img.onerror = function () {
        callback(false);
    };
    img.src = url;
}
export function getHostName(url: string) {
    const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im);
    return match && match.length > 1 ? match[1] : null;
}

export function guid(): string {
    let d = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
