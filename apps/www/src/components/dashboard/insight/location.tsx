import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClearFilter } from "./clear-filter";
import { InsightTablesProps } from "./tables";
import { InsightTable } from "./table";
import COUNTRIES from "@/lib/constants";
import { TableCell, TableRow } from "@/components/ui/table";
import { Link2Icon } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import LocationMap from "./location-map";

export const Location = ({
    filter: { isFilterActive, clearFilter, addFilter },
    data,
    isLoading,
}: Omit<InsightTablesProps, "setCurrentTableTab">) => {
    function searchFn(key: string, term: string) {
        addFilter({
            operator: "contains",
            key,
            value: term,
        });
    }
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 grid-cols-1 my-4">
            <Card className=" md:col-span-3 bg-gradient-to-tr from-stone-950 to-stone-900/80">
                <CardContent className=" bg-stone-950 py-4">
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
            </Card>
            <Card className="md:col-span-4 bg-stone-950">
                <CardContent>
                    <LocationMap data={data ? data.data.locations.country : []} />
                </CardContent>
            </Card>
        </div>
    );
};
