"use client";

import { AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    a11yDark as lightTheme,
    gruvboxLight as darkTheme,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { CopyToClipboard } from "./copy-to-clipboard";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const snippets = [
    {
        name: "nextjs/app-tsx",
        getCode: (id: string) => `import Loglib from "@loglib/tracker/react";
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <html lang="en">
            <body>
                {children}
                <Loglib
                    config={{
                        id: "${id}",
                    }}
                />
            </body>
        </html>
        );
}      
  `,
        icon: Icons.typescript,
        fileName: "app/layout.tsx",
        description: "Copy the following code in  main layout file:",
    },
    {
        name: "nextjs/app-jsx",
        getCode: (id: string) => `import Loglib from "@loglib/tracker/react";
export default function RootLayout({
    children,
  }) {
    return (
        <html lang="en">
            <body>
                {children}
                <Loglib
                    config={{
                        id: "${id}",
                    }}
                />
            </body>
        </html>
    );
}     
  `,
        icon: Icons.javascript,
        fileName: "app/layout.js",
        description: "Copy the following code in  main layout file:",
    },
    {
        name: "nextjs-tsx",
        getCode: (id: string) => `import Loglib from "@loglib/tracker/react";
export default function App({ Component, pageProps }: AppProps) {
     return (
        <>
            <Component {...pageProps} />
            <Loglib
                config={{
                    id: "${id}",
                }}
            />
        </>
    );
}
`,
        icon: Icons.typescript,
        fileName: "pages/_app.tsx",
        description: "Copy the following code in your main app file:",
    },
    {
        name: "nextjs-jsx",
        getCode: (id: string) => `import Loglib from "@loglib/tracker/react"
export default function App({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <Loglib config={{
                id: "${id}" 
            }} />
        </>
    );
}
  `,
        icon: Icons.javascript,
        fileName: "pages/_app.js",
        description: "Copy the following code in your main app file",
    },
    {
        name: "other-frameworks-jsx",
        getCode: (id: string) => `import {loglib} from "@loglib/tracker"

loglib.record({
    id: "${id}" 
})
  `,
        icon: Icons.javascript,
        fileName: "main.js",
        description: "Call record function in your main/entry file",
    },
    {
        name: "other-frameworks-tsx",
        getCode: (id: string) => `import {loglib} from "@loglib/tracker"

loglib.record({
    id: "${id}" 
})
    `,
        icon: Icons.typescript,
        fileName: "main.ts",
        description: "Call record function in your main/entry file",
    },
    {
        name: "cdn",
        getCode: (id: string) => `<head>
        <script src="https://cdn.jsdelivr.net/npm/@loglib/tracker@latest/dist/index.global.js" data-id="${id}"></script>
</head>
  `,
        icon: Icons.htmlLogo,
        fileName: "index.html",
        lang: "html",
        description: "simply copy the following code into your script tag",
        hideLangSelector: true,
    },
    {
        name: "wordpress",
        getCode: (id: string) => `
  We're not live on wordpress plugin store just yet 
  but you can download the plugin from github and install it manually in your wordpress site.
  you can find the plugin here:
  https://github.com/loglib/loglib-wordpress-plugin
  Then you can update the plugin settings with your website id.
  id: ${id}
  `,
        icon: Icons.wordpress,
        lang: "text",
        fileName: "wordpress-plugin",
        description:
            "Download the plugin from github and install it manually in your wordpress site.",
        hideLangSelector: true,
    },
];

export const AddTracker = ({
    websiteId,
    show,
}: {
    websiteId: string;
    show: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(show);
    const [selected, setSelected] = useState(snippets[0]);
    const [selectedFramework, setSelectedFramework] = useState("nextjs");
    const [selectedLang, setSelectedLang] = useState("tsx");

    useEffect(() => {
        function changeLang() {
            const snippet = snippets.find((snippet) => snippet.name === selectedFramework);
            if (!snippet) {
                setSelected(
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    snippets.find(
                        (snippet) => snippet.name === `${selectedFramework}-${selectedLang}`,
                    )!,
                );
            } else {
                setSelected(snippet);
            }
        }
        changeLang();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLang, selectedFramework]);
    const { theme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && !isMobile && (
                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    className="font-jost mx-4 flex h-full items-center  justify-center border-none outline-none backdrop:blur-xl"
                    style={{
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            backdropFilter: "blur(5px)",
                        },
                        content: {},
                    }}
                >
                    <div className=" animate-in relative flex h-max flex-col rounded-md  border bg-gradient-to-tr from-gray-50 to-gray-200  px-4 pb-6 dark:border-stone-800 dark:from-black dark:to-gray-800/20">
                        <div className=" flex items-center justify-between  py-2">
                            <div className=" flex items-center gap-2">
                                {/* <div className=" w-2 h-2 bg-gradient-to-tr from-logo to-yellow-600 animate-pulse rounded-full" /> */}
                                <p className=" bg-gradient-radial from-logo my-2 to-yellow-600 bg-clip-text text-sm font-medium text-transparent">
                                    Follow the steps below to add loglib to your website
                                </p>
                            </div>
                            <Button
                                className=" ml-auto flex items-center"
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </Button>
                        </div>
                        <div className="py-2">
                            <div className="group relative flex items-center">
                                <span className="relative z-10 flex h-4 w-4  items-center justify-center rounded-full border p-4 dark:border-stone-800">
                                    1
                                </span>
                                <span className="flex min-w-0 flex-col">
                                    <span className="text-sm font-semibold tracking-wide">
                                        <SyntaxHighlighter
                                            language="bash"
                                            style={theme === "dark" ? lightTheme : darkTheme}
                                            wrapLines
                                            customStyle={{
                                                background: "none",
                                                fontSize: "0.8rem",
                                                border: "none",
                                            }}
                                        >
                                            pnpm add @loglib/tracker
                                        </SyntaxHighlighter>
                                    </span>
                                </span>
                                <span>
                                    <CopyToClipboard text="pnpm add @loglib/tracker" />
                                </span>
                            </div>
                        </div>
                        <div className="group relative flex items-start gap-2">
                            <span className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border p-4 dark:border-stone-800">
                                2
                            </span>
                            <div className=" bg-gradient-br animate-in relative flex h-max w-[600px] flex-col rounded-md  border from-gray-100 to-gray-300 pb-6 dark:border-stone-800 dark:from-black dark:to-gray-800/20 ">
                                <div className=" flex  items-center justify-between space-y-2 border-b p-4 md:py-2">
                                    <div className=" flex items-center gap-2">
                                        <selected.icon />
                                        <p className=" text-xs ">{selected.fileName}</p>
                                    </div>
                                    <div className=" flex w-max items-center gap-2">
                                        <Select
                                            defaultValue="nextjs"
                                            onValueChange={(value) => setSelectedFramework(value)}
                                        >
                                            <SelectTrigger className=" text-xs ">
                                                <SelectValue placeholder="select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="nextjs" className=" text-xs">
                                                    Next JS
                                                </SelectItem>
                                                <SelectItem value="nextjs/app" className=" text-xs">
                                                    Next App Route
                                                </SelectItem>
                                                <SelectItem
                                                    value="other-frameworks"
                                                    className=" text-xs"
                                                >
                                                    Other Frameworks
                                                </SelectItem>
                                                <SelectItem value="wordpress" className=" text-xs">
                                                    Wordpress
                                                </SelectItem>
                                                <SelectItem value="cdn" className=" text-xs">
                                                    CDN
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {!selected.hideLangSelector && (
                                            <Select
                                                defaultValue="tsx"
                                                onValueChange={(value) => setSelectedLang(value)}
                                            >
                                                <SelectTrigger className=" w-max text-xs">
                                                    <SelectValue placeholder="select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="tsx" className=" text-xs">
                                                        Typescript
                                                    </SelectItem>
                                                    <SelectItem value="jsx" className=" text-xs">
                                                        Javascript
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                        <CopyToClipboard text={selected.getCode(websiteId)} />
                                    </div>
                                </div>
                                <SyntaxHighlighter
                                    language={selected.lang ?? "jsx"}
                                    style={theme === "dark" ? lightTheme : darkTheme}
                                    wrapLines
                                    showLineNumbers
                                    customStyle={{
                                        background: "none",
                                        fontSize: "0.8rem",
                                        border: "none",
                                    }}
                                >
                                    {selected.getCode(websiteId)}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AnimatePresence>
    );
};
