import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/table-skeleton";

const Page = async () => {
    return (
        <section className=" space-y-8">
            <HeaderSkeleton />

            <Card className=" bg-gradient-to-tr from-white/80 to-white dark:from-stone-900/30 dark:to-black">
                <CardContent>
                    <DataTableSkeleton columnCount={4} />
                </CardContent>
            </Card>
        </section>
    );
};

export default Page;

export const HeaderSkeleton = () => {
    return (
        <div className="flex flex-col gap-6 mt-10">
            <Skeleton className="rouneded-xl p-5 w-72" />
            <div className="flex w-full gap-5">
                <Skeleton className="rounded-xl p-10 w-3/4" />
                <Skeleton className="rounded-xl p-10 w-1/4" />
            </div>
        </div>
    );
};
