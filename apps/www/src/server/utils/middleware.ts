import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { ROLE } from "@loglib/types/models";
import { inArray } from "drizzle-orm";
import { User } from "next-auth";

export const protectedAction = async <T>(
    fn: (user: User) => Promise<T>,
    withRole?: { role: ROLE[]; teamId: string },
) => {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    } else {
        if (withRole) {
            const teamUser = await checkRole(user, withRole.teamId, withRole.role);
            if (!teamUser) {
                return null;
            }
        }
        return await fn(user);
    }
};

export const checkRole = async (user: User, teamId: string, role: ROLE[]) => {
    const teamUser = await db.query.teamMember.findFirst({
        where(fields, operators) {
            return operators.and(
                operators.eq(fields.userId, user.id),
                operators.eq(fields.teamId, teamId),
                inArray(fields.role, role),
            );
        },
    });
    return teamUser;
};
