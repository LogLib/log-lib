import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { queries } from "./queries";

export const getWebsite = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  const userWebsites = await db.query.website.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, user.id);
    },
  });
  const ids = userWebsites.map((website) => website.id);
  const teamWebsites = await db.query.teamWebsites
    .findMany({
      with: {
        team: {
          with: {
            teamMembers: {
              where(fields, operators) {
                return operators.and(
                  operators.eq(fields.userId, user.id),
                  operators.eq(fields.accepted, true)
                );
              },
            },
          },
        },
      },
    })
    .then((res) =>
      res.filter(
        (r) =>
          r.team?.teamMembers?.length &&
          r.websiteId &&
          !ids.includes(r.websiteId)
      )
    );

  const sites = userWebsites.map(async (web) => {
    return {
      ...web,
      visitors: await queries.getTodayVisitorsCount(web.id),
    };
  });
  const teamSites = teamWebsites.map(async (web) => {
    return {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      ...web.website!,
      visitors: await queries.getTodayVisitorsCount(web.websiteId as string),
    };
  });
  return {
    teamWebsites: await Promise.all(teamSites),
    userWebsites: await Promise.all(sites),
  };
};

export type Websites = Awaited<ReturnType<typeof getWebsite>>;
