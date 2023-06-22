"use client";

import "../css/index.css";
import React, { FC, useEffect, useState } from "react";
import { DatePicker, CalendarDateRangePicker } from "./components/ui/datePicker";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import useSWR from 'swr'
import { cn, fetcher, getTheme, getUrl } from "./lib/utils";
import { GetInsightResponse } from "@loglib/core"
import { InsightCard } from "./components/insight/insightCard";
import { Activity, Asterisk, Eye, Laptop2, MapPin, MonitorSmartphone, PanelTop, TimerIcon, UserIcon, Users2 } from "lucide-react";
import { PagesComponent } from "./components/insight/pages";
import { RefComponent } from "./components/insight/referrer";
import { DeviceComponent } from "./components/insight/devices";
import { LocationsComponent } from "./components/insight/locations";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { getToday, getTomorrow } from "./lib/timeHelper";
import { Graph } from "./components/insight/visitorsGraph";
import Events from "./events";
import { Filter, FilterProp } from "./lib/filter";
import { Login } from "./login";
import ct from "countries-and-timezones"
import { DefaultHeader } from "./components/header";


type DashboardProps = {
  websiteId?: string,
  components?: typeof defaultComponents
  className?: string
}

const defaultComponents = {
  header: DefaultHeader,
}

export const Dashboard: FC<DashboardProps> = (props) => {
  const [timeRange, setTimeRange] = useState<{
    startDate: Date,
    endDate: Date,
    stringValue?: string
  }>({
    startDate: getToday(),
    endDate: getTomorrow(),
    stringValue: "24hr"
  });

  const [customTime, setCustomTime] = useState(false)

  const [filters, setFilters] = useState<Filter[]>([])
  const [isAuth, setIsAuth] = useState(true)
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)

  const { data, isLoading } = useSWR<GetInsightResponse>(getUrl() + `?startDate=${timeRange.startDate.toUTCString()}&endDate=${timeRange.endDate.toUTCString()}&timeZone=${timezone}&filter=${JSON.stringify(filters)}&path=/dashboard&websiteId=${props.websiteId ?? ""}`, fetcher, {
    onError(err: { response: { status: number; } }) {
      if (err.response.status === 401) {
        setIsAuth(false)
      }
    },
  })

  function addFilter(f: Filter) {
    setFilters([...filters, f])
  }

  function clearFilter(key: string) {
    setFilters((prev) => prev.filter((f) => f.key !== key))
  }

  const isFilterActive = (key: string) => filters.some((filter) => filter.key === key)


  const filter: FilterProp = {
    addFilter,
    clearFilter,
    isFilterActive
  }

  const [token, setToken] = useState("")

  //for some reason addis ababa is not included in the list of timezones which is I'm from
  const timezones = { ...ct.getAllTimezones(), "Africa/Addis_Ababa": { name: "Africa/Addis_Ababa" } }

  useEffect(() => {
    const theme = getTheme()
    document.documentElement.classList.add(theme);
    const storedToken = localStorage.getItem("ll-token")
    if (storedToken) {
      setToken(storedToken)
      setIsAuth(true)
    }
  }, []);

  function defaultLogout() {
    {
      setIsAuth(false)
      setToken('')
      localStorage.removeItem("ll-token")
      sessionStorage.removeItem("ll-auth")
    }
  }


  //set default components if not provided
  const components = props.components ?? defaultComponents
  return (
    <main>
      <LayoutGroup>
        <div className={cn(" min-h-screen bg-background w-full space-y-4 p-8 pt-6  transition-all duration-700 dark:text-white/90 scrollbar-hide", props.className)}>
          <components.header timezone={timezone} setTimezone={setTimezone} timezones={timezones} logoutFn={defaultLogout} hideLogout={!token} />
          {isAuth ?
            <Tabs defaultValue="insights" className="space-y-4" >
              <TabsList>
                <TabsTrigger
                  value="insights"
                  className="data-[state=active]:text-emphasis"
                >
                  Insights
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:text-emphasis"
                >
                  Events
                </TabsTrigger>

              </TabsList>
              <div className=" flex justify-between">
                <div className=" flex gap-2 items-center">
                  <DatePicker setTimeRange={setTimeRange} setCustomTime={setCustomTime} timeRange={timeRange} customTime={customTime} />
                </div>
                <div className=" flex flex-col items-end">
                  <div className=" flex gap-1 items-center">
                    <div className=" w-2.5 h-2.5 bg-gradient-to-tr from-lime-500 to-lime-700 animate-pulse rounded-full" >
                    </div>
                    <p className=" text-sm bg-gradient-to-tr from-lime-600 to-lime-800 text-transparent bg-clip-text font-medium">
                      {data ? data.onlineUsers : 0} Online
                    </p>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {customTime && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "keyframes",
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    <CalendarDateRangePicker setDate={setTimeRange} date={{
                      from: timeRange.startDate,
                      to: timeRange.endDate
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                <motion.div layout>
                  <TabsContent value="insights" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 grid-cols-2 lg:grid-cols-4">
                      <InsightCard
                        title={"Unique Visitors"}
                        Icon={UserIcon}
                        data={data ? data.insight.uniqueVisitors : { change: 0, total: 0 }}
                        isLoading={isLoading}
                      />
                      <InsightCard
                        title={"Views"}
                        Icon={Eye}
                        data={data ? data.insight.pageView : { change: 0, total: 0 }}
                        isLoading={isLoading}
                      />
                      <InsightCard
                        title={"Average Time"}
                        Icon={TimerIcon}
                        data={data ? data.insight.averageTime : { change: 0, total: 0 }}
                        valuePrefix={""}
                        isLoading={isLoading}
                      />
                      <InsightCard
                        title={"Bounce Rate"}
                        valuePrefix={"%"}
                        Icon={Activity}
                        negative
                        data={data ? data.insight.bounceRate : { change: 0, total: 0 }}
                        isLoading={isLoading}
                      />

                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 grid-cols-1">
                      <Card className="md:col-span-4">
                        <Tabs defaultValue="visitors">
                          <CardHeader className=" flex-row justify-between items-center">
                            <CardTitle>Visitors</CardTitle>
                            <TabsList>
                              <TabsTrigger value="visitors">
                                Visitors

                              </TabsTrigger>
                              <TabsTrigger value="sessions">
                                Sessions

                              </TabsTrigger>
                            </TabsList>
                          </CardHeader>
                          <CardContent className="pl-2">
                            <TabsContent value="visitors">
                              <Graph data={data ? data.graph.uniqueVisitorsByDate : []} name="Visitors" Icon={Users2} isLoading={isLoading} />
                            </TabsContent>
                            <TabsContent value="sessions">
                              <Graph data={data ? data.graph.uniqueSessionByDate : []} name="Sessions" Icon={Laptop2} isLoading={isLoading} />
                            </TabsContent>
                          </CardContent>
                        </Tabs>
                      </Card>
                      <Card className=" md:col-span-3">
                        <Tabs defaultValue="pages">
                          <TabsList className="md:w-full space-x-2 md:justify-start grid grid-cols-4">
                            <TabsTrigger value="pages" className=" space-x-2 ">
                              <PanelTop size={16} />
                              <p>Pages</p>
                            </TabsTrigger>
                            <TabsTrigger
                              value="locations"
                              className=" space-x-2"
                            >
                              <MapPin size={16} />
                              <p>Locations</p>
                            </TabsTrigger>
                            <TabsTrigger value="ref" className=" space-x-2">
                              <Asterisk size={16} />
                              <p>Referees</p>
                            </TabsTrigger>
                            <TabsTrigger value="device" className=" space-x-2">
                              <MonitorSmartphone size={16} />
                              <p>Devices</p>
                            </TabsTrigger>

                          </TabsList>

                          <TabsContent value="pages">
                            <PagesComponent pageViews={data ? data.data.pages : []} filter={filter} isLoading={isLoading} />
                          </TabsContent>
                          <TabsContent value="locations">
                            <LocationsComponent country={data ? data.data.locations.country : []} city={data ? data.data.locations.city : []} filter={filter} isLoading={isLoading} />
                          </TabsContent>
                          <TabsContent value="ref">
                            <RefComponent refs={data ? data.data.referrer : []} filter={filter} isLoading={isLoading} />
                          </TabsContent>
                          <TabsContent value="device">
                            <DeviceComponent devices={data ? data.data.devices : []} os={data ? data.data.os : []} browser={data ? data.data.browser : []} filter={filter} isLoading={isLoading} />
                          </TabsContent>
                        </Tabs>
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="events">
                    <Events events={data ? data.eventsWithData : []} isLoading={isLoading} />
                  </TabsContent>

                </motion.div>
              </AnimatePresence>
            </Tabs>
            : <Login setAuth={setIsAuth} setToken={setToken} />
          }

        </div>
      </LayoutGroup>
    </main>
  );
}