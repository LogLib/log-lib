import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { schema } from "@loglib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const apiKeysCtxSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});
export const DELETE = async (_: Request, context: z.infer<typeof apiKeysCtxSchema>) => {
    try {
        apiKeysCtxSchema.parse(context);
        const user = await getCurrentUser();
        if (!user) return new Response(null, { status: 401 });
        // const isUserOwned = await db.apiKey.findFirst({
        //     where: {
        //         AND: {
        //             id: context.params.id,
        //             userId: user.id,
        //         },
        //     },
        // });
        const isUserOwned = await db.query.apiKey.findFirst({
            where(fields, operators) {
                return operators.and(
                    operators.eq(fields.id, context.params.id),
                    operators.eq(fields.userId, user.id),
                );
            },
        });
        if (!isUserOwned)
            return new Response(null, {
                status: 401,
            });
        await db.delete(schema.apiKey).where(eq(schema.apiKey.id, context.params.id));
    } catch {
        return new Response(null, {
            status: 500,
        });
    }
};
