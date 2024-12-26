import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  TabModified,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/billing-tab";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { nCommaFormat } from "@/lib/utils";
import { getUsage } from "@/server/actions/billing";
import { Eye, Layout, MousePointerClick } from "lucide-react";
import { getTeams } from "@/server/query";
import { UsageCard } from "@/components/usage-card";

const Setting = async ({ params }: { params: { slug: string[] } }) => {
  const user = await getCurrentUser();
  const teams = await getTeams();
  if (!user) {
    throw Error("user not found");
  }
  const route = params.slug[params.slug.length - 1];
  const userWithBillingInfo = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, user.id);
    },
  });
  const startDate =
    userWithBillingInfo?.billingCycleStart ??
    userWithBillingInfo?.createdAt?.getDate();
  const lastMonth = new Date();
  const thisMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const { ...usage } = await getUsage(lastMonth, thisMonth, user.id);

  function getMonthName(date: Date): string {
    const monthNames: string[] = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthIndex: number = date.getMonth();
    return monthNames[monthIndex];
  }

  return (
    <section className=" space-y-8">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">Setting</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account settings
        </p>
        <Separator className=" mt-4" />
      </div>
      <TabModified defaultValue={route}>
        <TabsList>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        <Separator className="w-full mb-4 mt-[-3px]" />
        <TabsContent value="billing" className="flex flex-col max-w-[76rem] ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7">
            <UsageCard
              title="sssWebsites"
              value={`${usage.websites}`}
              icon="layout"
            />
            <UsageCard
              title="Custom Events"
              value={`${nCommaFormat(usage.customEvents)}`}
              icon="events"
            />
            <UsageCard
              title="Page View"
              value={`${nCommaFormat(usage.pageViews)}`}
              icon="mousePointerClick"
            />
            <UsageCard
              title="Teams"
              value={`${teams.length}`}
              description="Teams Created So Far"
              icon="users"
            />
          </div>
        </TabsContent>
        <TabsContent value="usage">
          <Card>
            <CardHeader className=" flex flex-row items-center justify-between">
              <CardTitle>Usage</CardTitle>
              <p className=" text-stone-300 text-sm">
                {`${getMonthName(lastMonth)} ${startDate}`} -{" "}
                {`${getMonthName(thisMonth)} ${startDate}`}
              </p>
            </CardHeader>
            <CardContent className=" space-y-4">
              <div className=" flex-grow">
                <div className=" flex items-center gap-2">
                  <Layout size={14} />
                  <p className=" font-bold text-stone-300">Websites</p>
                </div>
                <p className=" text-sm mt-2">{usage.websites}</p>
                <Progress value={usage.websites * 100} className=" h-2 mt-2" />
              </div>
              <div className=" flex-grow">
                <div className=" flex items-center gap-2">
                  <Eye size={16} />
                  <p className=" font-bold text-stone-300">Pageviews</p>
                </div>

                <p className=" text-sm mt-2">
                  {`${nCommaFormat(usage.pageViews)}`}
                </p>
                <Progress value={usage.pageViews * 100} className="h-2 mt-2" />
              </div>
              <div className=" flex-grow">
                <div className=" flex items-center gap-2">
                  <MousePointerClick size={14} />
                  <p className=" font-bold text-stone-300">Custom Events</p>
                </div>

                <p className=" text-sm mt-2">
                  {`${nCommaFormat(usage.customEvents)}`}
                </p>
                <Progress
                  value={usage.customEvents * 100}
                  className=" h-2 mt-2"
                />
                <p className=" text-xs mt-2 text-ston-400">
                  {nCommaFormat(usage.customEvents)} left
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </TabModified>
    </section>
  );
};
export default Setting;
