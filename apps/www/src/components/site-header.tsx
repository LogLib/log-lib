"use client";

import { User } from "next-auth";
// import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useState } from "react";

import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import { LandingNav } from "./landing-nav";
import { Button } from "./ui/button";
import { UserAccountNav } from "./user-account-nav";

import { motion } from "framer-motion";

export function SiteHeader({ user }: { user?: User }) {
    const [mobileView, setMobileView] = React.useState(false);
    const [initialRender, setInitialRender] = useState(true);
    const pathname = usePathname();

    const genericHamburgerLine =
        "h-1 w-8 my-1 rounded-full bg-gray-900 dark:bg-gray-100 transition ease-in transform duration-300";
    const variants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: "-100%" },
    };

    React.useEffect(() => {
        setMobileView(false);
        setInitialRender(false);
    }, []);

    React.useEffect(() => {
        if (mobileView) {
            document.body.classList.add("overflow-y-hidden");
        } else {
            document.body.classList.remove("overflow-y-hidden");
        }
    }, [mobileView]);

    React.useEffect(() => {
        if (!initialRender) {
            setMobileView(false);
        }
    }, [pathname, initialRender]);

    return (
        <div className="flex items-center justify-between md:mx-16 sticky top-0 mb-16 z-50 bg-white/60 backdrop-blur-sm dark:bg-stone-950/80 py-4 px-4 md:px-0">
            <div
                className=" absolute h-1 bottom-0 w-full"
                style={{
                    background:
                        "radial-gradient(62.87% 100% at 50% 100%,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 100%)",
                }}
            />
            <Icons.logoWithLetter />
            {/* for medium or large screens */}
            <div className="hidden md:block">
                <LandingNav />
            </div>
            {/* for small screens(mobile view) */}

            <div className="flex items-center gap-4 font-medium">
                <Link href={user ? "/dashboard" : "/login"}>
                    <Button variant="outline">{user ? "Dashboard" : "Login"}</Button>
                </Link>
                <div
                    className="humberger z-50 flex md:hidden "
                    onClick={() => setMobileView(!mobileView)}
                >
                    <button
                        className="flex flex-col h-12 w-12  rounded justify-center items-center group"
                        onClick={() => setMobileView(!mobileView)}
                    >
                        <div
                            className={`${genericHamburgerLine} ${
                                mobileView
                                    ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
                                    : "opacity-50 group-hover:opacity-100"
                            }`}
                        />

                        <div
                            className={`${genericHamburgerLine} ${
                                mobileView ? "opacity-0" : "opacity-50 group-hover:opacity-100"
                            }`}
                        />
                        <div
                            className={`${genericHamburgerLine} ${
                                mobileView
                                    ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
                                    : "opacity-50 group-hover:opacity-100"
                            }`}
                        />
                    </button>
                </div>
                <motion.nav
                    className="fixed md:hidden top-0 left-0 min-h-screen h-[100%] flex w-full dark:bg-stone-950/80 backdrop-blur-[10px]"
                    initial={"closed"}
                    animate={mobileView ? "open" : "closed"}
                    variants={variants}
                >
                    <LandingNav mobileView />
                </motion.nav>
            </div>
        </div>
    );
}

export function DashboardHeader({ user }: { user: User }) {
    return (
        <header className="flex items-center backdrop-blur-lg justify-between border-b pb-4 top-0 py-4 z-30 sticky dark:border-gray-800">
            <Icons.logoWithLetter />
            <div className="flex items-center gap-2 font-medium">
                <div className="relative col-span-1 select-none flex-col items-center justify-center self-center lg:flex"></div>
                <UserAccountNav user={user} />
            </div>
        </header>
    );
}

export function PublicDashboardHeader() {
    return (
        <header className="mt-4 flex items-center justify-between border-b pb-4 dark:border-gray-800">
            <Icons.logoWithLetter />
            <div className="flex items-center gap-2 font-medium">
                <div className="relative col-span-1 select-none flex-col items-center justify-center self-center lg:flex"></div>
            </div>
        </header>
    );
}
