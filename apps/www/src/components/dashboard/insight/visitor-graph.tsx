import { TimeRange } from "../type";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
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

export function Graph({
    data,
    name,
    isLoading,
    setTimeRange,
    Icon,
    bar,
}: {
    data: { date: string; visits: number }[];
    name: string;
    Icon: LucideIcon;
    isLoading: boolean;
    setTimeRange: (range: TimeRange) => void;
    bar: boolean;
}) {
    const [isMobile, setIsMobile] = useState<boolean>();
    const [, setFilter] = useState(false);
    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);
    const ParentDiv = bar ? BarChart : LineChart;
    return (
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 400} className=" rounded-lg">
            {data.length ? (
                <ParentDiv
                    data={data}
                    onClick={(e) => {
                        if (!data) return;
                        const startDate = new Date(e.activePayload?.[0].payload.originalDate);
                        const stringDate = e.activePayload?.[0].payload.date.split(" ");
                        const endDate = new Date(e.activePayload?.[0].payload.originalDate);
                        console.log(stringDate, "string date", startDate[1]);
                        if (stringDate[1] === "AM" || stringDate[1] === "PM") {
                            endDate.setHours(endDate.getHours() + 1);
                        } else if (stringDate[1]) {
                            endDate.setDate(startDate.getDate() + 1);
                        } else {
                            endDate.setMonth(startDate.getMonth() + 1);
                        }
                        setTimeRange({
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                            stringValue: "custom",
                        });
                        setFilter(true);
                    }}
                >
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
                        width={30}
                        axisLine={false}
                        tickMargin={0}
                        tickFormatter={(value) => `${value}`}
                    />
                    {bar ? (
                        <Bar
                            dataKey="visits"
                            fill="#1b1917"
                            color="#000"
                            label="Visitors"
                            stroke="#110F04"
                        />
                    ) : (
                        <Line dataKey="visits" fill="#fff" label="Visitors" stroke="#494141" />
                    )}

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "black",
                            borderRadius: "10px",
                            color: "black",
                        }}
                        label="visitors"
                        cursor={bar ? false : true}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="custom-tooltip dark:bg-black bg-white/10 px-2 border rounded-md border-gray-700 py-2">
                                        <div className=" flex items-center gap-2 dark:text-emphasis text-black">
                                            <Icon size={16} />
                                            <p className=" font-medium">{`${payload[0]?.value} ${name}`}</p>
                                        </div>
                                        <p className="text-gray-400 text-sm">{label}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                </ParentDiv>
            ) : (
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
                                        docs
                                    </a>
                                    how to do that.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </ResponsiveContainer>
    );
}
