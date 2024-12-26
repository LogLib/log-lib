"use client";
import styles from "./hero.module.css";
import { useEffect } from "react";

export const Hero = () => {
    useEffect(() => {
        let index = 0;
        const interval = 1000;

        const rand = (min: number, max: number) =>
            Math.floor(Math.random() * (max - min + 1)) + min;

        const animate = (star: HTMLElement) => {
            star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
            star.style.setProperty("--star-top", `${rand(-40, 80)}%`);
            star.style.animation = "none";
            star.offsetHeight;
            star.style.animation = "";
        };
        const stars = document.getElementsByClassName("star");
        for (const star of stars) {
            setTimeout(() => {
                animate(star as HTMLElement);
                setInterval(() => animate(star as HTMLElement), 1000);
            }, index++ * (interval / 3));
        }
    }, []);
    return (
        <div className="font-heading max-w-3xl text-4xl font-bold text-stone-800 dark:text-stone-300">
            <h1 className=" hover:opacity-95 flex flex-wrap flex-col md:flex-row items-start md:item gap-2 dark:text-stone-100/80 2xl:text-4xl md:text-3xl text-lg">
                <span className=" relative inline-block">
                    <span className={styles.star}>
                        <svg viewBox="0 0 512 512">
                            <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                        </svg>
                    </span>
                    <span className={styles.star}>
                        <svg viewBox="0 0 512 512">
                            <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                        </svg>
                    </span>
                    <span className={styles.star}>
                        <svg viewBox="0 0 512 512">
                            <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
                        </svg>
                    </span>
                    <span className={styles.magicText}>Crafted with care.</span>
                </span>{" "}
                <span className=" hidden md:block  bg-gradient-to-tr dark:from-stone-300 from-stone-500 to-stone-600 dark:to-stone-400 bg-clip-text text-transparent">
                    Privacy First.
                </span>
                <span className=" hidden md:block  bg-gradient-to-tr dark:from-stone-300 from-stone-500 to-stone-600 dark:to-stone-400 bg-clip-text text-transparent">
                    Open Source.
                </span>
            </h1>
            <h1 className="bg-gradient-to-br md:text-6xl xl:text-7xl 2xl:text-8xl lg:text-6xl text-5xl from-orange-400 to-gray-200 bg-clip-text uppercase text-transparent dark:from-gray-200 dark:to-orange-400">
                web analytics
            </h1>
        </div>
    );
};
