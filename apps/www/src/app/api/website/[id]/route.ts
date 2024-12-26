import { authOptions } from "@/lib/auth";
import { removeWebsiteData } from "@/lib/clickhouse";
import { db } from "@/lib/db";
import { websiteFormSchema } from "@/lib/validations/website";
import { schema } from "@loglib/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { z } from "zod";

const routeContextSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});

export const PATCH = async (request: Request, context: z.infer<typeof routeContextSchema>) => {
    try {
        const {
            params: { id },
        } = routeContextSchema.parse(context);
        if (!id) {
            return new Response("Id not specified", { status: 400 });
        }
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 403 });
        }
        // const userWebsite = await db.website.findMany({
        //     where: {
        //         AND: {
        //             userId: session.user.id,
        //             id,
        //         },
        //     },
        // });
        const userWebsite = await db.query.website.findMany({
            where(fields, operators) {
                return operators.and(
                    operators.eq(fields.userId, session.user.id),
                    operators.eq(fields.id, id),
                );
            },
        });
        if (!userWebsite) {
            return new Response("Website not found", { status: 404 });
        }
        const body = websiteFormSchema.parse(await request.json());
        const res = await db
            .update(schema.website)
            .set({
                url: body.url,
                title: body.title,
                id: body.id,
                public: body.public,
            })
            .where(eq(schema.website.id, id));
        if (body.team !== undefined) {
            const isSiteInTeam = await db.query.teamWebsites.findFirst({
                where(fields, operators) {
                    return operators.and(
                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                        operators.eq(fields.teamId, body.team!),
                        operators.eq(fields.websiteId, body.id),
                    );
                },
            });
            if (!isSiteInTeam) {
                await db.insert(schema.teamWebsites).values({
                    websiteId: body.id,
                    teamId: body.team,
                });
            }
        }
        return new Response(JSON.stringify(res), { status: 200 });
    } catch (e) {
        console.log(e);
        return new Response(null, { status: 500 });
    }
};

export const DELETE = async (_: Request, context: z.infer<typeof routeContextSchema>) => {
    try {
        const {
            params: { id },
        } = routeContextSchema.parse(context);
        if (!id) {
            return new Response("Id not specified", { status: 400 });
        }
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        const userWebsite = await db.query.website.findMany({
            where(fields, operators) {
                return operators.and(
                    operators.eq(fields.userId, session.user.id),
                    operators.eq(fields.id, id),
                );
            },
        });

        if (!userWebsite) {
            return new Response("Website not found", { status: 404 });
        }
        await db.delete(schema.website).where(eq(schema.website.id, id));
        //delete events
        await removeWebsiteData({ websiteId: id });
        return new Response(null, { status: 200 });
    } catch {
        return new Response(null, { status: 500 });
    }
};
