"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import React from "react";
import { ArrowDown, ArrowUpIcon, LucideIcon } from "lucide-react";

export type InsightType = {
  title: string,
  Icon: LucideIcon,
  data: {
    total: number | string,
    change: number
  }
  valuePrefix?: string,
  changePrefix?: string,
  bottomChildren?: React.ReactNode,
  negative?: boolean,
  isLoading?: boolean
}

export function InsightCard({ title, Icon, data, valuePrefix, bottomChildren, isLoading, negative, changePrefix }: InsightType) {
  const increase = negative ? data.change <= 0 : data.change >= 0;
  return (
    <Card className=" bg-gradient-to-tr dark:from-black  dark:to-slate-900 border from-white to-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      {
        !isLoading && data ? <CardContent>
          <div className="text-2xl font-bold">{`${data.total ? data.total.toLocaleString() : 0} ${valuePrefix ?? ""}`}</div>
          <div className=" flex justify-between">
            <div className=" flex text-xs">
              {
                increase ? (
                  <ArrowUpIcon className=" text-green-500" size={16} />
                ) : (
                  <ArrowDown className=" text-red-500" size={16} />)
              }
              <div> {changePrefix ?? ""}{data.change ? data.change.toLocaleString() : 0}%</div>
            </div>
            {bottomChildren}
          </div>

        </CardContent> : <CardContent className=" h-24 w-full animate-pulse">
          <div className="flex flex-col justify-center gap-2">
            <div className="text-2xl font-bold">
              <div className="bg-gray-200 dark:bg-gray-800 h-7 w-24 "></div>
            </div>
            <div className="text-2xl font-bold">
              <div className="bg-gray-200 dark:bg-gray-800 h-4 w-9 "></div>
            </div>
          </div>
        </CardContent>
      }
    </Card>
  );
}


