import { ReactNode } from "react";

import {
  DashboardHeader,
  PublicDashboardHeader,
} from "@/components/site-header";
import { getCurrentUser } from "@/lib/session";
import { StoreSetter } from "@/components/store-setter";
import { getUsage } from "@/server/actions/billing";

export default async function layout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const lastMonth = new Date();
  const thisMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const usage = user && (await getUsage(lastMonth, thisMonth, user.id));
  return (
    <main className="mx-auto max-w-[1820px] space-y-8 md:px-16 px-4 min-h-[99vh]  bg-gradient-to-tr dark:from-stone-950 dark:to-stone-950/50 from-white to-stone-200">
      {user && <StoreSetter store="usage" data={usage ?? null} />}
      {user ? <DashboardHeader user={user} /> : <PublicDashboardHeader />}
      <div>{children}</div>
    </main>
  );
}
