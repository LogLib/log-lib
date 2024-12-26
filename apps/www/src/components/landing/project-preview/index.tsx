"use client";

import clsx from "clsx";
import { useState } from "react";

import { GitHubIcon, NpmIcon } from "@/components/extra-icons";
import { SectionButton } from "@/components/sections/SectionButton";
import SectionContent from "@/components/sections/SectionContent";
import AppWindow from "@/components/wireframes/AppWindow";
import GitHubWireframe from "@/components/wireframes/Github";
import NpmWireframe from "@/components/wireframes/Npm";
import { GitFork, Star } from "lucide-react";

function ProjectsContents({
    gitForks,
    githubStars,
    npmSize,
    npmVersion,
}: { githubStars: number; gitForks: number; npmVersion: number; npmSize: number }) {
    const [currentState, setCurrentState] = useState<"npm" | "github">("github");
    return (
        <>
            <main className="w-11/12 m-30"></main>
            <SectionContent>
                <div className={clsx("flex", "lg:gap-12")}>
                    <div className={clsx("hidden flex-1 flex-col gap-3 pt-8", "lg:flex")}>
                        <div className={clsx("flex flex-col gap-3")}>
                            <SectionButton
                                title="Available on GitHub"
                                icon={<GitHubIcon className={clsx("my-2 h-16 w-16")} />}
                                description="Access powerful and flexible package on GitHub with MIT license."
                                active={currentState === "github"}
                                onClick={() => setCurrentState("github")}
                                BottomChildren={() => (
                                    <div className=" flex items-center gap-2">
                                        <div className=" flex items-center gap-2 mt-2">
                                            <Star size={16} />
                                            {githubStars}
                                        </div>
                                        <div className=" flex items-center gap-2 mt-2">
                                            <GitFork size={16} />
                                            {gitForks}
                                        </div>
                                    </div>
                                )}
                            />
                            <SectionButton
                                title="npm package"
                                icon={<NpmIcon className={clsx("my-2 h-16 w-16")} />}
                                description="Install and use the package with ease thanks to its typed options."
                                active={currentState === "npm"}
                                onClick={() => setCurrentState("npm")}
                                BottomChildren={() => (
                                    <div className=" flex items-center gap-2 mt-2">
                                        <div className=" bg-orange-500 p-1 px-2 rounded-sm font-bold">
                                            <p className=" text-xs">v {npmVersion}</p>
                                        </div>
                                        <div className=" flex items-center">
                                            <div className=" bg-stone-900 p-1 px-2 rounded-l-sm">
                                                <p className=" text-xs font-bold">Minified Size</p>
                                            </div>
                                            <div className=" bg-blue-700 p-1 px-2 rounded-r-sm">
                                                <p className=" text-xs font-bold">{8} kb</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                    <div className={clsx("w-full", "lg:w-auto")}>
                        <div className={clsx("-mt-[41px]")}>
                            <div className={clsx("w-full", "lg:h-[400px] lg:w-[600px]")}>
                                <AppWindow
                                    type="browser"
                                    browserTabs={[
                                        {
                                            icon: <GitHubIcon className="h-4 w-4" />,
                                            title: "loglib/loglib - GitHub",
                                            isActive: currentState === "github",
                                        },
                                        {
                                            icon: <NpmIcon className="h-4 w-4" />,
                                            title: "@Loglib/tracker - npm",
                                            isActive: currentState === "npm",
                                        },
                                    ]}
                                >
                                    {currentState === "github" && (
                                        <GitHubWireframe
                                            author="loglib"
                                            license="MIT"
                                            repository="loglib"
                                            description="Yet another web analytics tool"
                                        />
                                    )}
                                    {currentState === "npm" && (
                                        <NpmWireframe
                                            packageName="@loglib/tracker"
                                            description="Yet another web analytics tool"
                                            isWithTypeScript
                                        />
                                    )}
                                </AppWindow>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContent>
        </>
    );
}

export default ProjectsContents;
