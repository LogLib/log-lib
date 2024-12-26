import { Metadata } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import { cn } from "@/lib/utils";
import { env } from "env.mjs";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
};

export default function LoginPage() {
    const active = {
        github: !!env.GITHUB_CLIENT_ID,
        google: !!env.GOOGLE_CLIENT_ID,
    };
    return (
        <div className="container  flex h-screen w-screen flex-col items-center justify-center">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 md:left-8 md:top-8",
                )}
            >
                <>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back
                </>
            </Link>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]  rounded-md">
                <div className="flex flex-col items-center">
                    <div className=" mx-auto flex items-end gap-2">
                        <Icons.logo className=" h-10 w-10" />
                        <h2 className="  text-3xl font-bold">LOGLIB</h2>
                    </div>
                </div>
                <UserAuthForm activeStrategy={active} />
            </div>
        </div>
    );
}
