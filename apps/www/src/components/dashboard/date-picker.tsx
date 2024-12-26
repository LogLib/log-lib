import { Calendar } from "./calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  getLast24Hour,
  getLastNinetyDays,
  getLastSevenDays,
  getLastThirtyDays,
  getThisMonth,
  getThisWeek,
  getThisYear,
  getToday,
  getYesterday,
} from "@/lib/time-helper";
import { cn } from "@/lib/utils";
import { format, subMonths } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { Fragment } from "react";
import { DateRange } from "react-day-picker";

export function CalendarDateRangePicker({
  date,
  setDate,
  className,
}: {
  date: DateRange;
  setDate: (state: {
    startDate: Date;
    endDate: Date;
    stringValue: string;
  }) => void;
  className?: string;
}) {
  const lastMonth = subMonths(new Date(), 1);
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-max justify-start text-left font-normal",
              !date && " text-stone-800"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-stone-950" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={lastMonth}
            selected={date}
            onSelect={(selected) => {
              if (selected?.from && selected.to) {
                setDate({
                  startDate: selected.from,
                  endDate: selected.to,
                  stringValue: "custom",
                });
              }
            }}
            numberOfMonths={2}
            toMonth={new Date()}
            toDate={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const DatePicker = ({
  setTimeRange,
  setCustomTime,
  timeRange,
  customTime,
}: {
  setTimeRange: React.Dispatch<
    React.SetStateAction<{
      startDate: Date;
      endDate: Date;
      stringValue?: string;
    }>
  >;
  timeRange: { startDate: Date; endDate: Date; stringValue?: string };
  setCustomTime: (state: boolean) => void;
  customTime: boolean;
}) => {
  function setTime(value: string) {
    setCustomTime(false);
    switch (value) {
      case "24hr":
        setTimeRange({
          startDate: getLast24Hour(),
          endDate: new Date(),
          stringValue: "24hr",
        });
        break;
      case "yesterday":
        setTimeRange({
          startDate: getYesterday(),
          endDate: getToday(),
          stringValue: "yesterday",
        });
        break;
      case "thisWeek":
        setTimeRange({
          ...getThisWeek(),
          stringValue: "thisWeek",
        });
        break;
      case "7days":
        setTimeRange({
          ...getLastSevenDays(),
          stringValue: "7days",
        });
        break;
      case "thisMonth":
        setTimeRange({
          ...getThisMonth(),
          stringValue: "thisMonth",
        });
        break;
      case "last30":
        setTimeRange({
          ...getLastThirtyDays(),
          stringValue: "last30",
        });
        break;
      case "last90":
        setTimeRange({
          ...getLastNinetyDays(),
          stringValue: "last90",
        });
        break;
      case "thisYear":
        setTimeRange({
          ...getThisYear(),
          stringValue: "thisYear",
        });
        break;
      default:
        setCustomTime(true);
        break;
    }
  }

  return (
    <div className=" flex space-x-2 items-center">
      <Select
        onValueChange={(value) => setTime(value)}
        value={customTime ? "custom" : timeRange.stringValue}
        defaultValue="24hr"
      >
        <SelectTrigger className="w-auto px-2 space-x-4 dark:text-white/75">
          <CalendarDays className=" dark:text-gray-300 text-gray-700" />
          <SelectValue placeholder="Select Time" />
        </SelectTrigger>

        <SelectContent className="dark">
          {/* <SelectLabel>Choose Range</SelectLabel> */}
          <SelectItem value={"24hr"}>Last 24 Hours</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <Separator className="my-2" />
          <SelectItem value="thisWeek">This Week</SelectItem>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <Separator className="my-2" />
          <SelectItem value="thisMonth">This Month</SelectItem>
          <SelectItem value="last30">Last 30 Days</SelectItem>
          <SelectItem value="last90">Last 90 Days</SelectItem>
          <SelectItem value="thisYear">This Year</SelectItem>
          <Fragment>
            <Separator className="my-2" />
            <SelectItem value="custom">Custom</SelectItem>
          </Fragment>
        </SelectContent>
      </Select>
    </div>
  );
};
