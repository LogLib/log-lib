import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import COUNTRIES from "@/lib/constants";
import { LoglibCustomEvent } from "@loglib/types";
import { Equal, EqualNot, SlidersHorizontal } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { filter } from "./small-filter";
import { loglib } from "@loglib/tracker";

export const EventFilter = ({
    data,
    setData,
}: {
    data: LoglibCustomEvent[];
    setData: (state: LoglibCustomEvent[]) => void;
}) => {
    const getUnqiueValue = (input: string[]) => {
        const set = new Set(input);
        return Array.from(set);
    };
    const countries = getUnqiueValue(data.map((d) => d.country ?? "unknown"));
    const cities = getUnqiueValue(data.map((d) => d.city ?? "unknown"));
    const browsers = getUnqiueValue(data.map((d) => d.browser ?? "unknown"));
    const devices = getUnqiueValue(data.map((d) => d.device ?? "unknown"));
    const os = getUnqiueValue(data.map((d) => d.os ?? "unknown"));
    const referrers = getUnqiueValue(data.map((d) => d.referrerDomain ?? "unknown"));
    const pages = getUnqiueValue(data.map((d) => d.currentPath ?? "unknown"));
    const referrerPages = getUnqiueValue(data.map((d) => d.referrerPath ?? "unknown"));
    const evenType = getUnqiueValue(data.map((d) => d.type ?? "unknown"));
    const filteData = [
        {
            title: "Country",
            placeholder: "Choose Country",
            data: countries,
            key: "country",
        },
        {
            title: "City",
            placeholder: "Choose City",
            data: cities,
            key: "city",
        },
        {
            title: "Browser",
            placeholder: "Choose Browser",
            data: browsers,
            key: "browser",
        },
        {
            title: "Device",
            placeholder: "Choose Device",
            data: devices,
            key: "device",
        },
        {
            title: "OS",
            placeholder: "Choose OS",
            data: os,
            key: "os",
        },
        {
            title: "Referrer",
            placeholder: "Choose Referrer",
            data: referrers,
            key: "referrerDomain",
        },
        {
            title: "Path",
            placeholder: "Choose Path",
            data: pages,
            key: "currentPath",
        },
        {
            title: "Referrer Path",
            placeholder: "Choose Referrer Path",
            data: referrerPages,
            key: "referrerPath",
        },
        {
            title: "Event Type",
            placeholder: "Choose Event Type",
            data: evenType,
            key: "type",
        },
    ];
    const [activeFilter, setActiveFilter] = useState<
        {
            title: string;
            placeholder: string;
            operator: "is" | "isNot";
            key: string;
            value: string;
            data: string[];
        }[]
    >([]);
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
            <DialogTrigger>
                <Button
                    onClick={() => {
                        loglib.track("filter open", {
                            activeFilters: activeFilter.length,
                            eventsCount: data.length,
                        });
                    }}
                    variant="outline"
                    className=" flex items-center relative gap-2 font-medium"
                >
                    <SlidersHorizontal size={14} />
                    Filter
                    <div className=" absolute -top-3 -right-1">
                        {activeFilter.length > 0 ? (
                            <span className=" bg-brand-950/50 border font-medium rounded-sm text-[8px] p-1">
                                {activeFilter.length}
                            </span>
                        ) : (
                            ""
                        )}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className=" my-2">Filters</DialogTitle>
                    <div className=" gap-2 items-center flex flex-wrap">
                        {filteData.map((filter) => (
                            <Toggle
                                size="sm"
                                aria-label="Toggle italic"
                                variant="outline"
                                pressed={
                                    activeFilter.find((f) => f.title === filter.title)
                                        ? true
                                        : false
                                }
                                onPressedChange={(pressed) => {
                                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                    const selectedFilter = filteData.find(
                                        (f) => f.title === filter.title,
                                    )!;

                                    if (pressed) {
                                        setActiveFilter((fil) => [
                                            ...fil,
                                            {
                                                ...selectedFilter,
                                                operator: "is",
                                                value: selectedFilter.data[0],
                                            },
                                        ]);
                                    } else {
                                        setActiveFilter((fil) =>
                                            fil.filter((f) => f.title !== selectedFilter.title),
                                        );
                                    }
                                }}
                            >
                                {filter.title}
                            </Toggle>
                        ))}
                    </div>
                </DialogHeader>
                <DialogDescription>
                    <ScrollArea>
                        <div className=" space-y-2">
                            {activeFilter.map((d) => (
                                <div className=" space-y-2" key={d.title}>
                                    <Label>{d.title}</Label>
                                    <div className=" flex items-center gap-2">
                                        <div className=" flex items-center gap-1">
                                            <Toggle
                                                size="sm"
                                                aria-label="Toggle italic"
                                                pressed={d.operator === "is"}
                                                onPressedChange={(p) => {
                                                    if (p) {
                                                        setActiveFilter((fil) =>
                                                            fil.map((f) => {
                                                                if (f.title === d.title) {
                                                                    return {
                                                                        ...f,
                                                                        operator: "is",
                                                                    };
                                                                }
                                                                return f;
                                                            }),
                                                        );
                                                    } else {
                                                        setActiveFilter((fil) =>
                                                            fil.map((f) => {
                                                                if (f.title === d.title) {
                                                                    return {
                                                                        ...f,
                                                                        operator: "isNot",
                                                                    };
                                                                }
                                                                return f;
                                                            }),
                                                        );
                                                    }
                                                }}
                                            >
                                                {d.operator === "is" ? (
                                                    <Equal size={14} />
                                                ) : (
                                                    <EqualNot size={14} />
                                                )}
                                            </Toggle>
                                        </div>
                                        <Select
                                            key={d.title}
                                            value={d.value}
                                            onValueChange={(v) => {
                                                setActiveFilter((fil) =>
                                                    fil.map((f) => {
                                                        if (f.title === d.title) {
                                                            return {
                                                                ...f,
                                                                value: v,
                                                            };
                                                        }
                                                        return f;
                                                    }),
                                                );
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={d.placeholder} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {d.data.map((item) => (
                                                    <SelectItem value={item} key={item}>
                                                        {d.title === "Country"
                                                            ? COUNTRIES[item]
                                                            : item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogDescription>
                <DialogFooter className=" flex items-center">
                    <Button
                        onClick={() => {
                            let filtered = data;
                            activeFilter.forEach((f) => {
                                filtered = filter(filtered)
                                    .where(f.key as keyof typeof data[0], f.operator, f.value)
                                    .execute();
                            });
                            setData(filtered);
                            setOpen(false);
                        }}
                    >
                        Filter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
