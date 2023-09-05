import { getWebsite } from "@/server/query/website";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import DashboardNav from "@/components/side-nav";
import { DashboardHeader } from "@/components/site-header";
import { StoreSetter } from "@/components/store-setter";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { getUsage } from "@/server/actions/billing";

export default async function DashboardSideBarLayout({
    children,
}: {
    children: ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) {
        return redirect("/login");
    }
    const { userWebsites, teamWebsites } = await getWebsite();
    const websites = userWebsites.concat(teamWebsites);
    const userWithPlan = await db.query.users.findFirst({
        where(fields, operators) {
            return operators.eq(fields.id, user.id)
        },
    })
    const lastMonth = new Date()
    const thisMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const usage = await getUsage(lastMonth, thisMonth, user.id)
    return (
        <div className=" space-y-8 px-4 md:px-16 ">
            <StoreSetter store="website" data={websites} />
            <StoreSetter store="user" data={user} />
            <StoreSetter store="teamWebsites" data={teamWebsites} />
            <StoreSetter store="userWebsites" data={userWebsites} />
            <StoreSetter store="usage" data={usage} />
            <DashboardHeader user={{ ...user, plan: userWithPlan?.plan ?? "free" }} />
            <main className="grid  gap-12 md:grid-cols-[200px_1fr] relative">
                <aside className="hidden w-[200px] flex-col pr-4 md:flex sticky top-0">
                    <DashboardNav
                        items={[
                            {
                                title: "Websites",
                                icon: "layout",
                                href: "/dashboard",
                            },
                            {
                                title: "Teams",
                                icon: "teams",
                                href: "/dashboard/team",
                                useInclude: true,
                                label: "beta",
                            },
                            {
                                title: "Api Keys",
                                icon: "key",
                                href: "/dashboard/api-keys",
                            },
                            {
                                title: "Setting",
                                icon: "settings",
                                href: "/dashboard/settings",
                                useInclude: true
                            }
                        ]}
                    />
                </aside>
                <main className="flex w-full  flex-col">{children}</main>
            </main>
        </div>
    );
}
