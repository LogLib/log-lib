import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { TabModified, TabsContent, TabsTrigger, TabsList } from "@/components/billing-tab";

export default function SettingLoading() {
    return (
        <section className="space-y-8">
            <div className="grid gap-1">
                <h1 className="font-heading text-3xl md:text-4xl">Setting</h1>
                <p className="text-muted-foreground text-lg">Manage your account settings</p>
                <Separator className=" mt-4" />
            </div>

            <TabModified defaultValue={"billing"}>
                <TabsList>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
                <Separator className="w-full mb-4 mt-[-3px]" />
                <TabsContent value="billing" className="flex flex-col max-w-[76rem] ">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7">
                        {Array.from("haha").map((_, i) => {
                            return (
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="size-4" />
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Skeleton className="h-6 w-12" />
                                        <Skeleton className="h-4 w-40" />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
                <TabsContent value="usage"></TabsContent>
            </TabModified>
            <div className="grid  max-w-[76rem] gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {Array.from("huh").map((_, i) => {
                    return <PricingCardSkeleton />;
                })}
            </div>
        </section>
    );
}

const PricingCardSkeleton = () => {
    return (
        <section className="bg-gradient-to-br from-stone-900 border to-stone-900/80 relative flex max-w-sm flex-col overflow-hidden rounded-lg shadow-lg">
            <div className="my-28 flex flex-col gap-3 animate-pulse"></div>
            <div className="flex flex-1 flex-col justify-between space-y-6 bg-stone-100 px-6 pb-8 pt-6 dark:bg-stone-950/80 sm:p-10 sm:pt-6">
                {Array.from("hahahaha").map((_, i) => {
                    return <Skeleton className="h-4 w-48" />;
                })}
            </div>
        </section>
    );
};
