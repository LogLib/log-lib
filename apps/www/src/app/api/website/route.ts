import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import cors from "@/lib/cors";
import { db } from "@/lib/db";
import { websiteFormSchema } from "@/lib/validations/website";
import { schema } from "@loglib/db";
import { eq } from "drizzle-orm";
import { DISALLOWED } from "./disallowed";

export const GET = async (_: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 403 });
        }
        const { user } = session;
        const websites = await db.query.website.findMany({
            where(fields, operators) {
                return operators.eq(fields.userId, user.id);
            },
        });
        return new Response(JSON.stringify(websites));
    } catch {
        return new Response(null, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const session = await getServerSession(authOptions);
        console.log(session, "sessions");
        if (!session) {
            return new Response("Unauthorized", { status: 403 });
        }
        const body = websiteFormSchema.parse(await request.json());
        const { user } = session;
        if (DISALLOWED.includes(body.id)) {
            return new Response("Website is disallowed", { status: 403 });
        }
        const website = await db.insert(schema.website).values({
            id: body.id,
            userId: user.id,
            url: body.url,
            title: body.title,
        });
        if (body.team) {
            await db.delete(schema.teamWebsites).where(eq(schema.teamWebsites.teamId, body.team));
            await db.insert(schema.teamWebsites).values({
                teamId: body.team,
                websiteId: body.id,
            });
        }
        return new Response(JSON.stringify(website), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (e: any) {
        console.log(e);
        return new Response(null, {
            status: 500,
        });
    }
};

export async function OPTIONS(request: Request) {
    return cors(
        request,
        new Response(null, {
            status: 204,
        }),
    );
}
