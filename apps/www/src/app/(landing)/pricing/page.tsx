"use client";

import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="relative max-w-full overflow-hidden gap-4 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="mx-auto max-w-6xl">
        <h1 className="bg-gradient-to-r from-stone-300 to-stone-400/80 bg-clip-text mb-3 text-center text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-relaxed">
          Pricing
        </h1>
      </div>
      <div className=" flex items-center justify-center">
        <p className=" max-w-lg break-words text-center font-medium text-stone-50 mb-10">
          Loglib is completely free. But we appreciate a support so we can pay for servers by funding through github sponsors!
        </p>
      </div>
      <div className=" flex-col md:flex-row flex items-center md:items-start justify-center space-y-2 md:space-y-0 md:gap-10 ">
        <Link href="https://github.com/sponsors/loglib">
          <Button className="gap-2" variant="outline">
            <GithubIcon size={15} />
            Sponsor us on Github
          </Button>
        </Link>
      </div>
    </div>
  );
}
