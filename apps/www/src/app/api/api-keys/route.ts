import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { apiKeySchema } from "@/lib/validations/api-key";
import { schema } from "@loglib/db";

export const POST = async (req: Request) => {
    try {
        const user = await getCurrentUser();
        if (!user)
            return new Response(null, {
                status: 401,
            });
        const data = apiKeySchema.parse(await req.json());
        // const currentKeysCount = await db.apiKey.count({
        //     where: {
        //         userId: user.id,
        //     },
        // });
        const currentKeysCount = await db.query.apiKey
            .findMany({
                where(fields, operators) {
                    return operators.eq(fields.userId, user.id);
                },
            })
            .then((res) => res.length);

        if (currentKeysCount >= 5)
            return new Response(
                JSON.stringify({
                    message: "You can only have 5 API keys at a time",
                }),
                {
                    status: 400,
                },
            );
        const key = `site_${Math.random().toString(36).substring(2, 12)}`;
        await db.insert(schema.apiKey).values({
            userId: user.id,
            expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * data.expiresIn),
            name: data.name,
            websiteId: data.website,
            token: key,
            createdAt: new Date(),
        });
        return new Response(
            JSON.stringify({
                key,
            }),
            {
                status: 200,
            },
        );
    } catch {
        return new Response(null, { status: 500 });
    }
};
