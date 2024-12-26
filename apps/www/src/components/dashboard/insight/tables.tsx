import { FilterProp } from "../type";
import { ClearFilter } from "./clear-filter";
import { DefaultIcons, RefIcons, RenderIcon } from "./ref-icons";
import { InsightTable } from "./table";
import { Card, CardContent } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import COUNTRIES from "@/lib/constants";
import { loglib } from "@loglib/tracker";
import { GetInsightResponse } from "@loglib/types";
import { Asterisk, Link2Icon, MapPin, MonitorSmartphone, PanelTop } from "lucide-react";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";

export type InsightTablesProps = {
    data?: GetInsightResponse;
    isLoading: boolean;
    setCurrentTableTab: (state: string) => void;
    filter: FilterProp;
    websiteUrl?: string;
};

export const InsightTables = ({
    data,
    websiteUrl,
    isLoading,
    setCurrentTableTab,
    filter: { isFilterActive, addFilter, clearFilter },
}: InsightTablesProps) => {
    function searchFn(key: string, term: string) {
        addFilter({
            operator: "contains",
            key,
            value: term,
        });
    }
    return (
        <Card className=" md:col-span-3 bg-gradient-to-tr from-stone-950 to-stone-900/50 ">
            <Tabs
                defaultValue="pages"
                onValueChange={(val) => {
                    setCurrentTableTab(val);
                    loglib.track("change-insight-table", {
                        table: val,
                    });
                }}
            >
                <TabsList className="md:w-full space-x-2 md:justify-start grid grid-cols-4">
                    <TabsTrigger value="pages" className=" space-x-2 ">
                        <PanelTop size={16} />
                        <p>Pages</p>
                    </TabsTrigger>
                    <TabsTrigger value="locations" className=" space-x-2">
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
                <TabsContent value="pages" className=" p-0">
                    <div className=" px-6 h-full p-0">
                        {isFilterActive("currentPath") ? (
                            <ClearFilter onClick={() => clearFilter("currentPath")} />
                        ) : null}
                        <InsightTable
                            data={data?.data.pages}
                            key="page"
                            meta={{
                                key: "page",
                                nameLabel: "Page",
                                valueLabel: "Visits",
                            }}
                            searchFn={(t) => searchFn("page", t)}
                            hideSearchBar={data && data?.data.pages.length < 10}
                            searchPlaceholder="Search Page..."
                            Row={(d) => (
                                <TableRow>
                                    <TableCell
                                        className=" flex items-center gap-1 cursor-pointer"
                                        onClick={() =>
                                            addFilter({
                                                key: "currentPath",
                                                value: d.page,
                                                operator: "is",
                                            })
                                        }
                                    >
                                        <a
                                            href={
                                                websiteUrl
                                                    ? `${
                                                          websiteUrl.endsWith("/")
                                                              ? websiteUrl
                                                              : `${websiteUrl}/`
                                                      }${d.page}`
                                                    : d.page
                                            }
                                            className=" hover:underline"
                                        >
                                            {d.page}
                                        </a>
                                    </TableCell>
                                    <TableCell className="text-right">{d.visits}</TableCell>
                                </TableRow>
                            )}
                            tip="Your pages and how many times they are visited :)"
                            isLoading={isLoading}
                        />
                    </div>
                </TabsContent>
                {/* Locations */}
                <TabsContent value="locations">
                    <CardContent>
                        <Tabs className=" w-full" defaultValue="country">
                            {isFilterActive("country") || isFilterActive("city") ? (
                                <ClearFilter
                                    onClick={() => {
                                        clearFilter("country");
                                        clearFilter("city");
                                    }}
                                />
                            ) : null}
                            <TabsList className=" border-gray-400 ml-auto">
                                <TabsTrigger value="country">Country</TabsTrigger>
                                <TabsTrigger value="city">City</TabsTrigger>
                            </TabsList>

                            <TabsContent value="country">
                                <InsightTable
                                    data={data?.data.locations.country.map((ctr) => ({
                                        location: COUNTRIES[ctr.location] ?? ctr.location,
                                        ogLocation: ctr.location,
                                        visits: ctr.visits,
                                    }))}
                                    searchPlaceholder="Search Country..."
                                    meta={{
                                        key: "location",
                                        nameLabel: "Country",
                                        valueLabel: "Visits",
                                    }}
                                    searchFn={(t) => {
                                        const term = Object.keys(COUNTRIES).find(
                                            (cty) => COUNTRIES[cty] === t,
                                        );
                                        if (term) {
                                            searchFn("country", term);
                                        }
                                    }}
                                    hideSearchBar={data && data?.data.locations.country.length < 10}
                                    isLoading={isLoading}
                                    tip="Your visitors country and how many times they are visited :)"
                                    Row={(location) => (
                                        <TableRow>
                                            <TableCell
                                                className=" flex items-center gap-1 cursor-pointer"
                                                onClick={() =>
                                                    addFilter({
                                                        key: "country",
                                                        value: location.ogLocation,
                                                        operator: "is",
                                                    })
                                                }
                                            >
                                                {location.location === "Unknown" ? (
                                                    <>
                                                        <Link2Icon />
                                                        Unknown
                                                    </>
                                                ) : (
                                                    <>
                                                        <ReactCountryFlag
                                                            countryCode={location.ogLocation}
                                                            svg
                                                            style={{
                                                                width: "1em",
                                                                height: "1em",
                                                            }}
                                                        />
                                                        {location.location}
                                                    </>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {location.visits}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="city">
                                <InsightTable
                                    data={data?.data.locations.city}
                                    meta={{
                                        key: "location",
                                        nameLabel: "City",
                                        valueLabel: "Visits",
                                    }}
                                    searchPlaceholder="Search City..."
                                    searchFn={(t) => searchFn("city", t)}
                                    hideSearchBar={data && data?.data.locations.city.length < 10}
                                    isLoading={isLoading}
                                    tip="Your visitors city and how many times they are visited :)"
                                    Row={(location) => (
                                        <TableRow>
                                            <TableCell
                                                className=" flex items-center gap-1 cursor-pointer"
                                                onClick={() =>
                                                    addFilter({
                                                        key: "country",
                                                        value: location.location,
                                                        operator: "is",
                                                    })
                                                }
                                            >
                                                {location.location === "Unknown" ||
                                                !location.location ? (
                                                    <>
                                                        <Link2Icon />
                                                        Unknown
                                                    </>
                                                ) : (
                                                    <>
                                                        <ReactCountryFlag
                                                            countryCode={location.country}
                                                            svg
                                                            style={{
                                                                width: "1em",
                                                                height: "1em",
                                                            }}
                                                        />
                                                        {location.location}
                                                    </>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {location.visits}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </TabsContent>

                {/* Referrer */}
                <TabsContent value="ref" className=" bg-stone-950">
                    <CardContent className=" bg-stone-950">
                        {isFilterActive("referrerDomain") ||
                        isFilterActive("utmCampaign") ||
                        isFilterActive("utmSource") ? (
                            <ClearFilter
                                onClick={() => {
                                    clearFilter("referrerDomain");
                                    clearFilter("utmCampaign");
                                    clearFilter("utmSource");
                                }}
                            />
                        ) : null}

                        <Tabs defaultValue="referrer" className=" bg-stone-950">
                            <TabsList>
                                <TabsTrigger value="referrer">Referrer</TabsTrigger>
                                <TabsTrigger value="sources">UTM Sources</TabsTrigger>
                                <TabsTrigger value="campaigns">UTM Campaigns</TabsTrigger>
                            </TabsList>
                            <TabsContent value="referrer">
                                <InsightTable
                                    data={data?.data.referrer}
                                    searchPlaceholder="Search Referrer.."
                                    meta={{
                                        key: "referrerDomain",
                                        nameLabel: "Referrer",
                                        valueLabel: "Visits",
                                    }}
                                    hideSearchBar={data && data?.data.referrer.length < 10}
                                    isLoading={isLoading}
                                    searchFn={(t) => searchFn("referrer", t)}
                                    tip="Your referees and how many time your website is visited from them :)"
                                    Row={(refs) => (
                                        <TableRow
                                            onClick={() => {
                                                addFilter({
                                                    key: "referrerDomain",
                                                    value: refs.referrerDomain
                                                        ? refs.referrerDomain
                                                        : "direct",
                                                    operator: "is",
                                                });
                                            }}
                                            className=" cursor-pointer"
                                        >
                                            <TableCell className="flex gap-2 items-center z-10">
                                                {RefIcons[
                                                    refs.referrer.toLowerCase() as keyof typeof RefIcons
                                                ] ? (
                                                    <RenderIcon
                                                        icon={refs.referrer.toLowerCase()}
                                                    />
                                                ) : (
                                                    <DefaultIcons url={refs.referrerDomain} />
                                                )}
                                                <Link
                                                    className=" hover:underline"
                                                    href={refs.referrerDomain}
                                                >
                                                    {refs.referrer.split(".").length > 1
                                                        ? refs.referrer
                                                        : refs.referrer.charAt(0).toUpperCase() +
                                                          refs.referrer.slice(1)}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {refs.visits}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="sources">
                                <InsightTable
                                    data={data?.data.utmSources}
                                    meta={{
                                        key: "utmSource",
                                        nameLabel: "Source",
                                        valueLabel: "Visits",
                                    }}
                                    searchPlaceholder="Search Source..."
                                    searchFn={(t) => searchFn("utmSource", t)}
                                    tip="Your UTM sources and how many time your website is visited from them :)"
                                    hideSearchBar={data && data?.data.utmSources.length < 10}
                                    isLoading={isLoading}
                                    Row={(refs) => (
                                        <TableRow
                                            onClick={() => {
                                                addFilter({
                                                    key: "utmSource",
                                                    value: refs.utmSource,
                                                    operator: "is",
                                                });
                                            }}
                                            className=" cursor-pointer"
                                        >
                                            <TableCell className="flex gap-1 items-center">
                                                {RefIcons[
                                                    refs.utmSource.toLowerCase() as keyof typeof RefIcons
                                                ] ? (
                                                    <RenderIcon
                                                        icon={refs.utmSource.toLowerCase()}
                                                    />
                                                ) : (
                                                    <DefaultIcons url={refs.utmSource} />
                                                )}
                                                {refs.utmSource}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {refs.visits}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="campaigns">
                                <InsightTable
                                    data={data?.data.utmCampaigns}
                                    searchPlaceholder="Search campaigns..."
                                    meta={{
                                        key: "utmCampaign",
                                        nameLabel: "Campaign",
                                        valueLabel: "Visits",
                                    }}
                                    tip="Your UTM campaigns and how many time your website is visited from them :)"
                                    hideSearchBar={data && data?.data.utmCampaigns.length < 10}
                                    isLoading={isLoading}
                                    Row={(refs) => (
                                        <TableRow
                                            onClick={() => {
                                                addFilter({
                                                    key: "referrerDomain",
                                                    value: refs.utmCampaign,
                                                    operator: "is",
                                                });
                                            }}
                                            className=" cursor-pointer"
                                        >
                                            <TableCell className="flex gap-1 items-center">
                                                {RefIcons[
                                                    refs.utmCampaign?.toLowerCase() as keyof typeof RefIcons
                                                ] ? (
                                                    <RenderIcon
                                                        icon={refs.utmCampaign?.toLowerCase()}
                                                    />
                                                ) : (
                                                    <DefaultIcons url={refs.utmCampaign} />
                                                )}
                                                {refs.utmCampaign}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {refs.visits}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </TabsContent>

                {/* device */}
                <TabsContent value="device" className=" bg-stone-950/30">
                    <CardContent className=" bg-stone-950/30">
                        <Tabs className=" w-full" defaultValue="general">
                            {isFilterActive("device") ||
                            isFilterActive("os") ||
                            isFilterActive("browser") ? (
                                <ClearFilter
                                    onClick={() => {
                                        clearFilter("device");
                                        clearFilter("os");
                                        clearFilter("browser");
                                    }}
                                />
                            ) : null}
                            <TabsList className=" border-gray-400 ml-auto">
                                <TabsTrigger value="general">Devices</TabsTrigger>
                                <TabsTrigger value="os">OS</TabsTrigger>
                                <TabsTrigger value="browser">Browser</TabsTrigger>
                            </TabsList>
                            <TabsContent value="general">
                                <InsightTable
                                    data={data?.data.devices}
                                    isLoading={isLoading}
                                    searchPlaceholder="Search device..."
                                    meta={{
                                        key: "device",
                                        nameLabel: "OS",
                                        valueLabel: "visits",
                                    }}
                                    tip="Your devices and how many time your website is visited from them :)"
                                    hideSearchBar={data && data?.data.devices.length < 10}
                                    Row={(d) => (
                                        <TableRow>
                                            <TableCell
                                                className=" flex items-center gap-1 cursor-pointer"
                                                onClick={() =>
                                                    addFilter({
                                                        key: "device",
                                                        value: d.device,
                                                        operator: "is",
                                                    })
                                                }
                                            >
                                                {d.device}
                                            </TableCell>
                                            <TableCell className="text-right">{d.visits}</TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="os">
                                <InsightTable
                                    data={data?.data.os}
                                    isLoading={isLoading}
                                    searchPlaceholder="Search OS..."
                                    meta={{
                                        key: "os",
                                        nameLabel: "OS",
                                        valueLabel: "visits",
                                    }}
                                    tip="Your OS and how many time your website is visited from them :)"
                                    hideSearchBar={data && data?.data.os.length < 10}
                                    Row={(d) => (
                                        <TableRow>
                                            <TableCell
                                                className=" flex items-center gap-1 cursor-pointer"
                                                onClick={() =>
                                                    addFilter({
                                                        key: "device",
                                                        value: d.os,
                                                        operator: "is",
                                                    })
                                                }
                                            >
                                                {d.os}
                                            </TableCell>
                                            <TableCell className="text-right">{d.visits}</TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="browser">
                                <InsightTable
                                    data={data?.data.browser}
                                    isLoading={isLoading}
                                    meta={{
                                        key: "browser",
                                        nameLabel: "OS",
                                        valueLabel: "visits",
                                    }}
                                    searchPlaceholder="search Browser..."
                                    tip="Your browsers and how many time your website is visited from them :)"
                                    hideSearchBar={data && data?.data.browser.length < 10}
                                    Row={(d) => (
                                        <TableRow>
                                            <TableCell
                                                className=" flex items-center gap-1 cursor-pointer"
                                                onClick={() =>
                                                    addFilter({
                                                        key: "device",
                                                        value: d.browser,
                                                        operator: "is",
                                                    })
                                                }
                                            >
                                                {d.browser}
                                            </TableCell>
                                            <TableCell className="text-right">{d.visits}</TableCell>
                                        </TableRow>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </TabsContent>
            </Tabs>
        </Card>
    );
};
