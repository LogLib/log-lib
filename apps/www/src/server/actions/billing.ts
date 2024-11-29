"use server";
import { db } from "@/lib/db";
import { queries } from "../query/queries";

export async function getUsage(startDate: Date, endDate: Date, userId: string) {
  const websites = await db.query.website.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
  });

  const findUsage = await queries.getTotalUsageCount(
    websites.map((w) => w.id),
    startDate,
    endDate
  );

  return {
    ...findUsage,
    websites: websites.length,
  };
}

export type Usage = Awaited<ReturnType<typeof getUsage>>;
