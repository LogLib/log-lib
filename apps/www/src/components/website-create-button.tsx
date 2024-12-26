"use client";

import { usageAtom, websiteFormAtom } from "@/jotai/store";
import { useAtom } from "jotai";
import * as React from "react";

import { Icons } from "@/components/icons";
import { Button, ButtonProps } from "@/components/ui/button";

export function WebsiteCreateButton({ ...props }: ButtonProps) {
    const [, setCreateWebsite] = useAtom(websiteFormAtom);
    const [usage] = useAtom(usageAtom);

    async function onClick() {
        if (usage) {
            setCreateWebsite(true);
        }
    }

    return (
        <Button onClick={onClick} {...props}>
            <Icons.add className="h-4 w-4 " />
            <span className="">New Website</span>
        </Button>
    );
}
