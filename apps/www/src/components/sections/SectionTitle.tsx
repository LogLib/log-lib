import clsx from "clsx";
import Link from "next/link";

import type { ReactNode } from "react";

interface SectionTitleProps {
    as?: "h2" | "h3";
    title: string;
    caption: string;
    description: string | ReactNode;
    button?: {
        title: string;
        href: string;
    } | null;
}

function SectionTitle({
    as = "h2",
    title,
    caption,
    description,
    button = null,
}: SectionTitleProps) {
    const Heading = as;

    return (
        <div className={clsx("content-wrapper")}>
            <Heading
                className={clsx(
                    "text-accent-600 mb-2 block font-black",
                    "lg:mb-4",

                    "dark:text-accent-400",
                )}
            >
                {caption}
            </Heading>
            {/* <p
        className={clsx(
          'mb-4 text-3xl font-black text-slate-700',
          'lg:text-4xl',
          'dark:text-slate-200'

          )}
      >
        {title}
      </p> */}

            <span className="mb-4 text-4xl from-logo bg-gradient-to-br to-orange-600 bg-clip-text font-black text-transparent lg:text-5xl">
                {title}

                <p className="text-white ">Your Website.</p>
            </span>
            <p className={clsx("max-w-screen text-xl mt-8 text-slate-600", "dark:text-slate-400")}>
                {description}
            </p>
            {button && (
                <div className={clsx("mt-1", "md:mt-6")}>
                    <Link href={button.href} className={clsx("button button--soft")}>
                        <div className="flex  gap-1 justify-start items-center"></div>
                        <div className="relative">
                            <div className="absolute h-2 w-32  from-logo bg-gradient-to-br to-orange-600 bottom-0"></div>
                            <p className="relative text-lg font-semibold">Explore More</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default SectionTitle;
