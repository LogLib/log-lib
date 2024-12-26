import { useIsMobile } from "@/hooks/use-viewport";
import { LucideIcon } from "lucide-react";
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Stat } from "./stats";

export const SpeedChart = ({
    data,
    Icon,
    activeStat,
    bar,
    isLoading,
}: {
    data?: { date: string; value: string }[];
    Icon: LucideIcon;
    activeStat: Stat;
    bar: boolean;
    isLoading: boolean;
}) => {
    const isMobile = useIsMobile();
    const ParentDiv = bar ? BarChart : LineChart;
    return (
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 400} className=" rounded-lg">
            {!data?.length ? (
                <div className=" flex flex-col justify-center gap-2">
                    <div className="text-2xl font-bold text-center ">
                        {isLoading ? (
                            <p className=" text-sm font-medium italic">hmm loading...</p>
                        ) : (
                            <>
                                <p>No Data Just Yet</p>
                                <p className=" text-sm font-light">
                                    if you haven`&apos;t setup tracker refer to the{" "}
                                    <a
                                        href="https://loglib.io/docs"
                                        target="_blank"
                                        className=" text-blue-700 underline"
                                        rel="noreferrer"
                                    >
                                        docs{" "}
                                    </a>
                                    how to do that.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <ParentDiv data={data}>
                    {bar ? (
                        <Bar dataKey="value" fill="#1b1917" />
                    ) : (
                        <Line
                            dataKey="value"
                            fill="#fff"
                            label={activeStat.name}
                            stroke="#494141"
                        />
                    )}
                    <XAxis
                        dataKey="date"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        interval="preserveStartEnd"
                        fontSize={12}
                        tickLine={false}
                        width={10}
                        axisLine={false}
                        tickMargin={0}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "black",
                            borderRadius: "10px",
                            color: "black",
                        }}
                        label="visitors"
                        cursor={false}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="custom-tooltip dark:bg-black bg-white/10 px-2 border rounded-md border-gray-700 py-2">
                                        <div className=" flex items-center gap-2 dark:text-emphasis text-black">
                                            <Icon size={16} />
                                            <p className=" font-medium">{`${activeStat.formatter(
                                                payload[0]?.value as number,
                                            )}`}</p>
                                        </div>
                                        <p className="text-gray-400 text-sm">{label}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </ParentDiv>
            )}
        </ResponsiveContainer>
    );
};
