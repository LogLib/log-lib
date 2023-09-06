"use client";

import { User } from "next-auth";
// import { useTheme } from "next-themes";
import Link from "next/link";
import React,{ useRef } from "react";

import { Icons } from "./icons";
import { LandingNav } from "./landing-nav";
import { Button } from "./ui/button";
import { UserAccountNav } from "./user-account-nav";
import Humburger from './landing/humburger';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SiteHeader({ user }: { user?: User }) {

  const [open,setOpen] = React.useState(false);
  const [mobileView,setMobileView] = React.useState(false);
  const genericHamburgerLine = `h-1 w-8 my-1 rounded-full bg-gray-900 dark:bg-gray-100 transition ease-in transform duration-300`;
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  }


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
        <div className="humberger z-50 flex md:hidden " onClick={()=>setMobileView(!mobileView)}>
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
        <motion.nav className="fixed md:hidden top-0 left-0 min-h-screen flex w-full dark:bg-stone-950/80 backdrop-blur-[10px]"
        animate={mobileView ? "open" : "closed"}
        variants={variants}
        >
          <LandingNav mobileView />

        </motion.nav>
        </div>


      </div>

  );
}

export function DashboardHeader({ user }: { user: User & { plan: string } }) {
  // const { setTheme, theme } = useTheme();
  const _switchOnRef = useRef<HTMLAudioElement>(null);
  const _switchOffRef = useRef<HTMLAudioElement>(null);
  return (
    <header className="mt-4 flex items-center justify-between border-b pb-4 dark:border-gray-800">
      <Icons.logoWithLetter />
      <div className="flex items-center gap-2 font-medium">
        <div className="relative col-span-1 select-none flex-col items-center justify-center self-center lg:flex">
          {/* <Button
            variant="ghost"
            id="dark-switch"
            onClick={() => {
              if (theme === "dark") {
                setTheme("light")
                switchOnRef.current?.play()
              } else {
                setTheme("dark")
                switchOffRef.current?.play()
              }
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 53 53"
              className="h-5 w-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.5 46.375C24.0708 46.375 21.9913 45.5101 20.2615 43.7802C18.5316 42.0504 17.6667 39.9708 17.6667 37.5417H11.0417C9.82709 37.5417 8.78696 37.1088 7.9213 36.2432C7.05563 35.3775 6.62353 34.3381 6.625 33.125C6.625 27.9722 8.31806 23.5276 11.7042 19.7911C15.0903 16.0546 19.2861 13.911 24.2917 13.3604V8.83334C24.2917 8.20765 24.5037 7.6828 24.9277 7.2588C25.3517 6.8348 25.8758 6.62354 26.5 6.62501C27.1257 6.62501 27.6505 6.83701 28.0745 7.26101C28.4985 7.68501 28.7098 8.20912 28.7083 8.83334V13.3604C33.7139 13.9125 37.9097 16.0568 41.2958 19.7933C44.6819 23.5298 46.375 27.9737 46.375 33.125C46.375 34.3396 45.9422 35.3797 45.0765 36.2454C44.2108 37.111 43.1714 37.5431 41.9583 37.5417H35.3333C35.3333 39.9708 34.4684 42.0504 32.7385 43.7802C31.0087 45.5101 28.9292 46.375 26.5 46.375ZM11.0417 33.125H41.9583C41.9583 28.8556 40.4493 25.2118 37.4313 22.1938C34.4132 19.1757 30.7694 17.6667 26.5 17.6667C22.2306 17.6667 18.5868 19.1757 15.5688 22.1938C12.5507 25.2118 11.0417 28.8556 11.0417 33.125Z"
                fill="#161010"
                className="transition-all duration-700 dark:fill-white"
              ></path>
            </svg>
          </Button>
          <audio
            id="switch-on"
            ref={switchOnRef}
            src="/audio/switch-on.mp3"
          ></audio>
          <audio
            id="switch-off"
            ref={switchOffRef}
            src="/audio/switch-off.mp3"
          ></audio> */}
        </div>
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
