import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-viewport";
import { cn, fetcher } from "@/lib/utils";
import { GetVitalsResponse } from "@loglib/types";
import { Website } from "@loglib/types/models";
import {
    ArrowDown,
    ArrowUpIcon,
    ArrowUpLeftFromCircle,
    BarChart,
    ExternalLinkIcon,
    GaugeCircle,
    LineChart,
    Monitor,
    Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import useSWR from "swr";
import { Filter, TimeRange } from "../type";
import { SpeedChart } from "./chart";
import { Stat, stats } from "./stats";
import { SpeedTables } from "./table";
export const SpeedInsight = ({
    website,
    timeRange,
    setting,
    token,
    url,
    showUpdateDialog,
}: {
    website: Website;
    timeRange: TimeRange;
    setting: {
        graph: string | null;
        timezone: string;
    };
    filters: Filter[];
    token: string;
    url: string;
    showUpdateDialog: boolean; //insight data is available
}) => {
    const { data, isLoading } = useSWR<GetVitalsResponse>(
        `${url}/vitals?websiteId=${
            website.id
        }&startDate=${timeRange.startDate.toUTCString()}&endDate=${timeRange.endDate.toUTCString()}&timeZone=${
            setting.timezone
        }&token=${token}`,
        fetcher,
    );

    const [activeStat, setActiveStat] = useState<typeof stats[0]>(stats[0]);
    const isMobile = useIsMobile();
    const [statsList, setStatsList] = useState<Stat[]>([]);
    useEffect(() => {
        setStatsList(isMobile ? stats.splice(0, 4) : stats);
    }, []);
    const [chartDevice, setChartDevice] = useState("desktop");
    const [chartType, setChartType] = useState("bar-graph");
    return (
        <div className="  gap-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 grid-cols-2 lg:grid-cols-5">
                {statsList.map((stat) => {
                    const value = data?.[stat.short].current;
                    const change = data?.[stat.short].change;
                    return (
                        <Card
                            className={cn(
                                activeStat.name === stat.name
                                    ? "flex-grow relative bg-gradient-to-tr from-stone-900 to-stone-950 shadow-sm shadow-brand-900/30"
                                    : "flex-grow opacity-80 cursor-pointer",
                            )}
                            key={stat.name}
                            onClick={() => setActiveStat(stat)}
                        >
                            {activeStat.name === stat.name && (
                                <span className="absolute top-0 h-px blur-sm left-1/2 w-1/2 bg-gradient-circle from-brand-500/90 rounded-md to-brand-800/30"></span>
                            )}
                            <CardHeader className=" md:flex-row md:justify-between md:items-center">
                                <CardTitle className=" text-sm xl:text-base">{stat.name}</CardTitle>
                                <Dialog>
                                    <DialogTrigger>
                                        <div className="w-max border px-3 cursor-pointer flex items-center gap-2 py-1 rounded-md  relative bg-brand-900/40">
                                            <ArrowUpLeftFromCircle size={12} />
                                            <span className="text-xs">{stat.short}</span>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <div className=" p-4  h-min space-y-2">
                                            <div>
                                                <p className=" font-bold">
                                                    {stat.name} ({stat.short})
                                                </p>
                                            </div>
                                            {activeStat.description}
                                            <Link
                                                href={`https://web.dev/${stat.short.toLowerCase()}`}
                                                target="_blank"
                                            >
                                                <Button
                                                    size="sm"
                                                    className="gap-2 mt-4 text-brand-400"
                                                    variant="outline"
                                                >
                                                    <ExternalLinkIcon size={14} />
                                                    <span>Learn More</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            {!isLoading && data ? (
                                <CardContent className=" flex md:flex-row flex-col md:items-center justify-between">
                                    <div className=" flex flex-col gap-1 items-start">
                                        <p className=" text-lg lg:text-xl xl:text-2xl font-bold">
                                            {stat.formatter(data?.[stat.short].current ?? 0)}
                                        </p>
                                        <div className="hidden border px-3 rounded-md py-px md:flex items-center justify-center">
                                            <span
                                                className="text-xs text-brand-800"
                                                style={{
                                                    color: stat.getRating(value).style,
                                                }}
                                            >
                                                {stat.getRating(value).label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className=" flex md:flex-col justify-between  gap-2">
                                        <div className="md:hidden border px-3 rounded-md py-px flex items-center justify-center">
                                            <span
                                                className="text-xs text-brand-800"
                                                style={{
                                                    color: stat.getRating(value).style,
                                                }}
                                            >
                                                {stat.getRating(value).label}
                                            </span>
                                        </div>
                                        <div className=" flex justify-between items-center">
                                            {change ? (
                                                <div className=" flex text-xs xl:text-sm items-center">
                                                    {change > 0 ? (
                                                        <ArrowUpIcon className=" text-green-500 w-4 xl:w-5" />
                                                    ) : (
                                                        <ArrowDown className=" text-red-500 w-4 xl:w-5" />
                                                    )}
                                                    <div>{`${change} %`}</div>
                                                </div>
                                            ) : (
                                                <div>-</div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            ) : (
                                <CardContent className=" h-24 w-full animate-pulse">
                                    <div className="flex flex-col justify-center gap-2">
                                        <div className="text-2xl font-bold">
                                            <div className="bg-gray-200 dark:bg-gray-800 h-7 w-24 "></div>
                                        </div>
                                        <div className="text-2xl font-bold">
                                            <div className="bg-gray-200 dark:bg-gray-800 h-4 w-9 "></div>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
            <div className="grid gap-4 min-h-max md:grid-cols-2 lg:grid-cols-7 grid-cols-1">
                <Card className="col-span-7 md:col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">
                            <Tabs onValueChange={setChartDevice} value={chartDevice}>
                                <TabsList className=" bg-stone-900">
                                    <TabsTrigger value="desktop">
                                        <div className=" flex items-center gap-1 text-xs md:text-sm">
                                            <Monitor size={isMobile ? 10 : 16} />
                                            Desktop
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="mobile">
                                        <div className=" flex items-center gap-1  text-xs md:text-sm">
                                            <Smartphone size={isMobile ? 10 : 16} />
                                            Mobile
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardTitle>

                        <Tabs value={chartType} onValueChange={setChartType}>
                            <TabsList className=" bg-stone-900">
                                <TabsTrigger value="bar-graph">
                                    <BarChart size={isMobile ? 14 : 18} />
                                </TabsTrigger>
                                <TabsTrigger value="line-graph">
                                    <LineChart size={isMobile ? 14 : 18} />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className=" w-full">
                        <SpeedChart
                            data={data?.graph[chartDevice][activeStat.short]}
                            Icon={GaugeCircle}
                            activeStat={activeStat}
                            bar={chartType === "bar-graph"}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
                <UpdateTrackerDialog
                    trigger={!isLoading && !data?.data.pages.length && showUpdateDialog}
                />
                <SpeedTables data={data?.data} activeStat={activeStat} isLoading={isLoading} />
            </div>
        </div>
    );
};

export const UpdateTrackerDialog = ({ trigger }: { trigger: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        setIsOpen(trigger);
    }, []);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>There is no data yet!</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Update the tracker to start collecting speed metrics
                </DialogDescription>
                <div className=" border rounded-md flex items-center justify-between pr-6">
                    <SyntaxHighlighter
                        language="bash"
                        style={a11yDark}
                        wrapLines
                        customStyle={{
                            background: "none",
                            fontSize: "0.8rem",
                            border: "none",
                        }}
                    >
                        pnpm i @loglib/tracker@latest
                    </SyntaxHighlighter>
                    <CopyToClipboard text="pnpm i @loglib/tracker@latest" />
                </div>
            </DialogContent>
        </Dialog>
    );
};
