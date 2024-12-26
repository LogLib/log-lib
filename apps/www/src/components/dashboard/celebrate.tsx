import { celebrateSettingAtom } from "@/jotai/store";
import { getLast24Hour } from "@/lib/time-helper";
import { loglib } from "@loglib/tracker";
import { AnimatePresence, motion } from "framer-motion";
import html2canvas from "html2canvas";
import { useAtom } from "jotai";
import { EyeIcon, PartyPopper, Settings, User } from "lucide-react";
import { block } from "million/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import Modal from "react-modal";
import { getToday } from "../../lib/time-helper";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { InsightCard } from "./insight/card";
import { CelebrateSetting } from "./setting/celebrate-setting";
import { GeneralSetting } from "./setting/general";

function getAnimationSettings(angle: number, originX: number) {
    return {
        particleCount: 4,
        angle,
        spread: 90,
        origin: { x: originX },
        colors: ["#d27800", "#f5a623", "#f8c471", "#ffffff", "#8cbe3f "],
    };
}

type Props = {
    pageview: {
        change: number;
        current: number;
    };
    uniqVisitor: {
        change: number;
        current: number;
    };
    websiteId?: string;
    time?: string;
    title?: string;
};

export function CelebrateFn({ pageview, uniqVisitor, websiteId, time, title }: Props) {
    const refAnimationInstance = useRef<confetti.CreateTypes | null>();
    const [intervalId, setIntervalId] = useState<any>();
    const [show, setShow] = useState(false);

    const getInstance = useCallback((instance: confetti.CreateTypes | null) => {
        refAnimationInstance.current = instance;
    }, []);

    const [cSetting, setCSetting] = useAtom(celebrateSettingAtom);

    const nextTickAnimation = useCallback(() => {
        if (refAnimationInstance.current) {
            refAnimationInstance.current(getAnimationSettings(60, 0));
            refAnimationInstance.current(getAnimationSettings(120, 1));
        }
    }, []);

    const startAnimation = useCallback(() => {
        if (!intervalId) {
            setIntervalId(setInterval(nextTickAnimation, 16));
        }
    }, [nextTickAnimation, intervalId]);

    useEffect(() => {
        return () => {
            clearInterval(intervalId);
        };
    }, [intervalId]);

    const pauseAnimation = useCallback(() => {
        clearInterval(intervalId);
        setIntervalId(null);
        setShow(false);
    }, [intervalId]);

    useEffect(() => {
        if (intervalId) {
            setTimeout(() => {
                pauseAnimation();
            }, 5000);
        }
    }, [intervalId]);

    useEffect(() => {
        if (cSetting.enabled && uniqVisitor) {
            const last24 = getLast24Hour();
            const shownToday = cSetting.lastShown > last24.getTime();
            if (!shownToday && uniqVisitor.current >= cSetting.uniqueVisitors) {
                setMsg("Yooo! today your site stats have been 🤯");
                setShow(true);
                startAnimation();
                setCSetting((p) => ({
                    ...p,
                    lastShown: Date.now(),
                    uniqueVisitors: cSetting.uniqueVisitors + 10,
                }));
                loglib.track("celebrate-animation-shown", {
                    uniqVisitor,
                    websiteId,
                });
            }
        }
    }, [cSetting.lastShown, uniqVisitor]);

    const handleDownloadImage = async () => {
        const element = document.getElementById("stat");
        if (!element) {
            throw new Error("Element not found");
        }
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL("image/jpg");
        const link = document.createElement("a");

        link.href = data;
        link.download = "downloaded-image.jpg";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    function getTimeString() {
        switch (time) {
            case "24hr":
                return "Today";
            case "7days":
                return "Last 7 days";
            case "thisWeek":
                return "This Week";
            case "last30":
                return "Last 30 days";
            case "thisMonth":
                return "This Month";
            case "last90":
                return "Last 90 days";
            default:
                return "";
        }
    }
    const [msg, setMsg] = useState(`Yooo! ${getTimeString()} your site stats have been 🤯`);
    return (
        <>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className=" flex items-center gap-2"
                    onClick={() => {
                        startAnimation();
                        setShow(true);
                        loglib.track("celebrate-animation-clicked", {
                            uniqVisitor,
                            websiteId,
                        });
                    }}
                >
                    <PartyPopper size={15} className=" text-brand-600" />
                    Celebrate
                </Button>
                <Dialog>
                    <DialogTrigger asChild className="hidden md:block">
                        <Button size="sm" variant="outline">
                            <Settings size={15} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <Tabs>
                            <TabsList>
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="celebrate">Celebrate</TabsTrigger>
                            </TabsList>
                            <TabsContent value="general">
                                <GeneralSetting />
                            </TabsContent>
                            <TabsContent value="celebrate">
                                <CelebrateSetting />
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>
            <ReactCanvasConfetti
                refConfetti={getInstance}
                style={{
                    position: "fixed",
                    pointerEvents: "none",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    zIndex: 100,
                }}
            />
            <AnimatePresence>
                {show ? (
                    <Modal
                        isOpen={show}
                        onRequestClose={() => {
                            startAnimation();
                            setShow(false);
                            pauseAnimation();
                        }}
                        className="font-jost flex h-full items-center justify-center border-none outline-none backdrop:blur-xl"
                        style={{
                            overlay: {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                backdropFilter: "blur(2px)",
                            },
                            content: {},
                        }}
                    >
                        <motion.div
                            id="stat"
                            variants={{
                                hidden: {
                                    opacity: 0,
                                    scale: 0.8,
                                },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, transition: { duration: 0.5 } }}
                            transition={{
                                type: "keyframes",
                                delay: 0.1,
                                ease: "easeInOut",
                                duration: 0.3,
                            }}
                            className="animate-in relative flex w-11/12 flex-col  justify-center rounded-md border bg-gradient-to-tr from-gray-100 to-gray-200 px-8 pb-10 pt-4 dark:from-black dark:to-stone-900/80 md:w-max"
                        >
                            <div className=" text-lg text-center">
                                <p className=" my-4 font-bold">{msg}</p>
                                <div className=" font-bold text-xl flex flex-col space-y-2">
                                    <div>
                                        <InsightCard
                                            title="Unique Visitors"
                                            Icon={User}
                                            data={{
                                                current: uniqVisitor.current,
                                                change:
                                                    uniqVisitor.change > 0 ? uniqVisitor.change : 0,
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <InsightCard
                                            title="Page Views"
                                            Icon={EyeIcon}
                                            data={{
                                                current: pageview.current,
                                                change: pageview.change > 0 ? pageview.change : 0,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=" mt-2 flex items-center justify-between">
                                <div className=" border border-stone-800 bg-stone-900/40 p-2 space-x-2 flex items-center text-brand-100 w-max rounded-sm">
                                    <Icons.logo className=" w-4 h-4" />
                                    <p className=" font-medium text-brand-100 text-xs">
                                        {title ?? websiteId}
                                    </p>
                                    <p className=" text-xs font-bold border-l px-2">
                                        {getToday().toLocaleString(undefined, {
                                            day: "numeric",
                                            year: "numeric",
                                            month: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div
                                    role="button"
                                    className=" space-x-2  cursor-pointer hover:bg-stone-900 p-2 flex items-center  text-brand-100 w-max rounded-sm"
                                    onClick={() => {
                                        handleDownloadImage();
                                    }}
                                >
                                    <p className=" font-medium text-white text-xs">
                                        {title ?? websiteId} *
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </Modal>
                ) : null}
            </AnimatePresence>
        </>
    );
}

export const ShareStat = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

export const Celebrate = block(CelebrateFn);
