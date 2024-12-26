"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeBlockProps extends React.HTMLProps<HTMLPreElement> {
    // set by `rehype-pretty-code`
    "data-language"?: string;
    // set by `rehype-pretty-code`
    "data-theme"?: string;
}

export function CodeBlock({ children, ...props }: CodeBlockProps) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const [isCopied, setIsCopied] = React.useState(false);

    return (
        <pre
            className="my-10  relative flex items-center gap-2 rounded-2xl border-l-[2px] bg-gradient-to-r from-[rgba(17,17,17,0)] via-stone-900/50 to-[rgba(17,17,17,0)]  px-0 py-2.5 font-mono text-sm font-light text-muted-foreground"
            {...props}
        >
            <ScrollArea className="flex-1 py-2">
                <span ref={ref}>{children}</span>
            </ScrollArea>
            <Button
                variant="link"
                // @ts-ignore
                size="icon"
                className="size-4 w-4 h-4 absolute right-3 top-2 bg-transparent text-muted-foreground  hover:text-zinc-50 "
                onClick={() => {
                    if (typeof window === "undefined") return;
                    setIsCopied(true);
                    void window.navigator.clipboard.writeText(ref.current?.innerText ?? "");
                    setTimeout(() => setIsCopied(false), 2000);
                }}
            >
                {isCopied ? (
                    <CheckIcon className="size-3" aria-hidden="true" />
                ) : (
                    <CopyIcon className="size-3" aria-hidden="true" />
                )}
                <span className="sr-only">{isCopied ? "Copied" : "Copy to clipboard"}</span>
            </Button>
        </pre>
    );
}
