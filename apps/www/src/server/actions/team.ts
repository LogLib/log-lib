"use server";

import { ROLE } from "@loglib/types/models";
import { z } from "zod";

import TeamInviteEmail from "@/components/emails/team-invite-email";
import { siteConfig } from "@/config/site";
import { sendEmail } from "@/lib/resend";

import { db } from "@/lib/db";
import { schema } from "@loglib/db";
import { and, eq, gte } from "drizzle-orm";
import { teamInviteSchema, teamSchema } from "../../lib/validations/team";
import { protectedAction } from "../utils/middleware";

export async function createTeam(data: z.infer<typeof teamSchema>) {
    return await protectedAction(async (user) => {
        const team = await db
            .insert(schema.team)
            .values({
                name: data.name,
                slug: data.name.toLowerCase().replace(/\s/g, "-"),
            })
            .returning();

        const teamUser = await db
            .insert(schema.teamMember)
            .values({
                teamId: team[0].id,
                role: "owner",
                accepted: true,
                email: user.email ?? "",
                userId: user.id,
            })
            .returning();
        return {
            ...team[0],
            TeamMembers: teamUser[0],
        };
    });
}

export async function inviteTeam(
    data: z.infer<typeof teamInviteSchema>,
    teamId: string,
    toResend?: boolean,
) {
    return await protectedAction(
        async (user) => {
            const team = await db.query.team.findFirst({
                where(fields, operators) {
                    return operators.eq(fields.id, teamId);
                },
            });
            if (!team) {
                throw new Error("Team not found");
            }
            const inviteToken =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            const invitedUser = await db.query.users.findFirst({
                where(fields, operators) {
                    return operators.eq(fields.email, data.email);
                },
            });
            const invites = await db.query.teamInvitation.findMany({
                where(fields, operators) {
                    return operators.and(
                        operators.eq(fields.teamId, teamId),
                        gte(fields.createdAt, new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
                    );
                },
            });
            if (invites.length > 3) {
                throw new Error("Invite limit reached.");
            }
            if (invitedUser) {
                if (toResend) {
                    const teamUser = await db.query.teamMember
                        .findFirst({
                            where(fields, operators) {
                                return operators.and(operators.eq(fields.id, invitedUser.id));
                            },
                            with: {
                                users: true,
                            },
                        })
                        .then((res) => ({
                            // rome-ignore lint/style/noNonNullAssertion: <explanation>
                            ...res!,
                            name: res?.users?.name as string,
                            email: res?.users?.email as string,
                            role: res?.role as "owner",
                        }));
                    if (teamUser) {
                        await db
                            .update(schema.teamInvitation)
                            .set({
                                status: "expired",
                            })
                            .where(
                                and(
                                    eq(schema.teamInvitation.teamId, teamId),
                                    eq(schema.teamInvitation.email, invitedUser.email),
                                ),
                            );
                        await db.insert(schema.teamInvitation).values({
                            teamId,
                            email: invitedUser.email,
                            status: "pending",
                            token: inviteToken,
                            createdAt: new Date(),
                            userId: invitedUser.id,
                        });
                    } else {
                        throw new Error("Team user doesn't exists");
                    }
                    await sendEmail({
                        email: data.email,
                        subject: "You've been invited to join a team",
                        react: TeamInviteEmail({
                            invitedByEmail: user.email ?? "",
                            teamName: team.name,
                            invitedByUsername: user.name ?? "",
                            inviteLink: `${siteConfig.url}/dashboard/team/invite/${inviteToken}`,
                            userImage: user.image ?? "",
                        }),
                    });
                    return teamUser;
                } else {
                    const teamUserInsert = await db
                        .insert(schema.teamMember)
                        .values({
                            teamId,
                            userId: invitedUser.id,
                            role: data.role as "owner",
                            accepted: false,
                            email: data.email,
                        })
                        .returning();

                    const teamUser = await db.query.teamMember
                        .findFirst({
                            where(fields, operators) {
                                return operators.and(operators.eq(fields.id, teamUserInsert[0].id));
                            },
                            with: {
                                users: true,
                            },
                        })
                        .then((res) => ({
                            // biome-ignore lint/style/noNonNullAssertion: <explanation>
                            // rome-ignore lint/style/noNonNullAssertion: <explanation>
                            ...res!,
                            name: res?.users?.name as string,
                            email: res?.users?.email as string,
                        }));
                    await db.insert(schema.teamInvitation).values({
                        teamId,
                        userId: invitedUser.id,
                        email: invitedUser.email,
                        token: inviteToken,
                    });
                    await sendEmail({
                        email: data.email,
                        subject: "You've been invited to join a team",
                        react: TeamInviteEmail({
                            invitedByEmail: user.email ?? "",
                            teamName: team.name,
                            invitedByUsername: user.name ?? "",
                            inviteLink: `${siteConfig.url}/dashboard/team/invite/${inviteToken}`,
                            userImage: user.image ?? "",
                        }),
                    });
                    return teamUser;
                }
            } else {
                return null;
            }
        },
        {
            role: ["admin", "owner"],
            teamId,
        },
    );
}

export async function leaveTeam(data: {
    teamId: string;
    userId: string;
    deleteTeam: boolean;
}) {
    return await protectedAction(
        async () => {
            if (data.deleteTeam) {
                await db.delete(schema.team).where(eq(schema.team.id, data.teamId));
            }
            await db
                .delete(schema.teamMember)
                .where(
                    and(
                        eq(schema.teamMember.teamId, data.teamId),
                        eq(schema.teamMember.userId, data.userId),
                    ),
                );
            return true;
        },
        {
            role: ["owner", "viewer", "admin"],
            teamId: data.teamId,
        },
    );
}

export async function updateTeam(data: z.infer<typeof teamSchema>, id: string) {
    return await protectedAction(
        async () => {
            await db
                .update(schema.team)
                .set({
                    name: data.name,
                })
                .where(eq(schema.team.id, id));
            const updated = await db.query.team.findFirst({
                where(fields, operators) {
                    return operators.eq(fields.id, id);
                },
                with: {
                    teamWebsites: {
                        with: {
                            website: true,
                        },
                    },
                },
            });
            return updated;
        },
        {
            role: ["owner", "admin"],
            teamId: id,
        },
    );
}

export const removeTeamUser = async (id: string, teamId: string) => {
    protectedAction(
        async () => {
            await db.delete(schema.teamMember).where(eq(schema.teamMember.id, id));
        },
        {
            role: ["owner", "admin"],
            teamId,
        },
    );
};

export const addWebsiteToTeam = async (teamId: string, websiteId: string) => {
    return await protectedAction(
        async () => {
            const isWebsiteAlreadyAdded = await db.query.teamWebsites.findFirst({
                where(fields, operators) {
                    return operators.and(
                        operators.eq(fields.teamId, teamId),
                        operators.eq(fields.websiteId, websiteId),
                    );
                },
            });
            if (isWebsiteAlreadyAdded) {
                return null;
            }
            await db.delete(schema.teamWebsites).where(eq(schema.teamWebsites.teamId, teamId));
            const res = await db.insert(schema.teamWebsites).values({
                teamId,
                websiteId,
            });
            return res;
        },
        {
            role: ["owner"],
            teamId,
        },
    );
};

export const removeAllTeamWebsites = async (teamId: string) => {
    return await protectedAction(
        async () => {
            await db.delete(schema.teamWebsites).where(eq(schema.teamWebsites.teamId, teamId));
            return true;
        },
        {
            role: ["owner"],
            teamId,
        },
    );
};

export const updateTeamUser = async (id: string, data: { role?: ROLE }, teamId: string) => {
    protectedAction(
        async () => {
            await db
                .update(schema.teamMember)
                .set({
                    role: data.role as "viewer",
                })
                .where(eq(schema.teamMember.id, id));
        },
        {
            role: ["owner", "admin"],
            teamId,
        },
    );
};
