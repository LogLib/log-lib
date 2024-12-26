import { Dashboard } from "@/components/dashboard";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/generate-token";
import { getCurrentUser } from "@/lib/session";
import { queries } from "@/server/query/queries";
import { getWebsite } from "@/server/query/website";
import { schema } from "@loglib/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { website: string };
}) {
  const user = await getCurrentUser();
  const token = generateToken({
    id: user?.id ?? "public",
    website: params.website as string,
  });
  const { teamWebsites } = await getWebsite();
  const website = await db.query.website.findFirst({
    where: (r, q) => {
      return q.or(eq(r.id, params.website));
    },
  });

  if (!website) {
    return notFound();
  }

  const isTeamMember = !!teamWebsites.find((w) => w.id === params.website);
  const isAuthed = website.userId === user?.id || isTeamMember;

  if (!isAuthed && !website.public) {
    return redirect("/");
  }

  const isPublic = website.public && !isAuthed;
  const showSetup = isPublic
    ? false
    : website.active
    ? false
    : await (async () => {
        const haveSession = (await queries.getIsWebsiteActive(params.website))
          .length;
        if (haveSession) {
          await db
            .update(schema.website)
            .set({
              active: true,
            })
            .where(eq(schema.website.id, params.website));
          return false;
        }
        return true;
      })();
  return (
    <main>
      <Dashboard
        website={{
          ...website,
        }}
        isPublic={isPublic}
        showSetup={showSetup}
        token={token}
      />
    </main>
  );
}
