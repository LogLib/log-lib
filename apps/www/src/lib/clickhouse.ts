import { createClient } from "@clickhouse/client";
import { env } from "env.mjs";

export const client = createClient({
    host: env.CLICKHOUSE_HOST,
    password: env.CLICKHOUSE_PASSWORD,
});

export const getIsWebsiteActive = async ({ websiteId }: { websiteId: string }) =>
    await client
        .query({
            query: `select id from loglib.event where websiteId = '${websiteId}' limit 1`,
            format: "JSONEachRow",
        })
        .then(async (res) => (await res.json()) as { id: string }[]);

export const removeWebsiteData = async ({ websiteId }: { websiteId: string }) => {
    const res = await client.query({
        query: `ALTER TABLE loglib.event DELETE WHERE websiteId = '${websiteId}'`,
    });
    console.log(res);
    return res;
};
