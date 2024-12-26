"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import COUNTRIES from "@/lib/constants";
import { LoglibCustomEvent } from "@loglib/types";
import { Row } from "@tanstack/react-table";

const renderSubComponent = ({ row }: { row: Row<LoglibCustomEvent> }) => {
    const data = row.original;
    const automaticProperties = {
        Browser: data.browser,
        City: data.city,
        Country: COUNTRIES[data.country ?? ""] ?? data.country,
        Device: data.device,
        Referrer: data.referrerPath,
        "Initial Referrer": data.referrerDomain,
        path: `${data.currentPath}`,
        "Operating System": data.os,
        "Session Duration":
            data.duration && data.duration > 100
                ? `${Math.floor(data.duration / 60)} min ${data.duration % 60} sec`
                : `${data.duration} sec`,
        "Session Id": data.sessionId,
        "Event Type": data.type,
        "User Id": data.visitorId,
        Language: data.language,
        Time: new Date(data.timestamp).toLocaleString(),
    };
    const customProperties = {
        ...(!data.payload
            ? {}
            : JSON.parse(
                  typeof data.payload === "string" ? data.payload : JSON.stringify(data.payload),
              )),
    };
    const allProperties = {
        ...automaticProperties,
        ...customProperties,
    };
    return (
        <div className=" w-full dark:border-gray-800 ">
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Properties</TabsTrigger>
                    <TabsTrigger value="auto">Automatic Properties</TabsTrigger>
                    <TabsTrigger value="custom">Custom Properties</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <div className="grid grid-cols-3 gap-4 py-4 px-2 place-content-center ">
                        {Object.keys(allProperties).map((key) => {
                            return (
                                <div
                                    className=" flex border-b dark:border-gray-800 py-2 gap-2"
                                    key={key}
                                >
                                    <div className="font-bold">{key}: </div>

                                    <div>
                                        {JSON.stringify(
                                            allProperties[key as keyof typeof allProperties],
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </TabsContent>
                <TabsContent value="auto">
                    <div className="grid grid-cols-3 gap-4 py-4 px-2 place-content-center ">
                        {Object.keys(automaticProperties).map((key) => {
                            return (
                                <div
                                    className=" flex border-b dark:border-gray-800 py-2 gap-2"
                                    key={key}
                                >
                                    <div className="font-bold">{key}: </div>
                                    <div>
                                        {JSON.stringify(
                                            allProperties[key as keyof typeof allProperties],
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </TabsContent>
                <TabsContent value="custom">
                    <div className="grid grid-cols-3 gap-4 py-4 px-2 place-content-center ">
                        {Object.keys(customProperties).map((key) => {
                            return (
                                <div
                                    className=" flex border-b dark:border-gray-800 py-2 gap-2"
                                    key={key}
                                >
                                    <div className="font-bold">{key}: </div>
                                    <div>{JSON.stringify(customProperties[key])}</div>
                                </div>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export { renderSubComponent };
