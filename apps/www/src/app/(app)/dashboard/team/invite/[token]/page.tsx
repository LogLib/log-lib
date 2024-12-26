import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { schema } from "@loglib/db";
import { eq } from "drizzle-orm";

const Page = async ({ params }: { params: { token: string } }) => {
    const user = await getCurrentUser();
    const invite = await db.query.teamInvitation.findFirst({
        where(fields, operators) {
            return operators.and(
                operators.eq(fields.token, params.token),
                operators.eq(fields.status, "pending"),
            );
        },
    });
    if (!invite) return redirect("/dashboard/team?expired=true");
    if (user?.id !== invite.userId) return redirect("/login");
    await db
        .update(schema.teamMember)
        .set({
            accepted: true,
        })
        .where(eq(schema.teamMember.accepted, true));
    await db
        .update(schema.teamInvitation)
        .set({
            status: "accepted",
        })
        .where(eq(schema.teamInvitation.id, invite.id));
    redirect("/dashboard/team?accepted=true");
    return null;
};

export default Page;
