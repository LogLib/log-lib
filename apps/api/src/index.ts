import "dotenv/config";
import { createClient } from "@clickhouse/client";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { convertDate, convertToUTC } from "./lib/utils";
import { getInsight } from "./routes/insight";
import { getTablesData } from "./routes/table";
import { Filter, LoglibEvent, Path } from "./type";
import { router } from "./routes";
import { apiQuery, envSchema, insightSchema } from "./schema";
import { client, customEventsQuery, getDataQuery, hitsQuery } from "./lib/db/clickhouse";
import { filter } from "./lib/small-filter";
import { retryFunction } from "./lib/retry";
import { serve } from "@hono/node-server";
import jwt from "jsonwebtoken";
import { logger } from "hono/logger";
import { db } from "./lib/db/kysley";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.post("/", async (c) => {
    envSchema.parse(process.env);
    const body = await c.req.json();
    if (!body.path) {
        return c.json(null, 200);
    }
    const path: Path = body.path;
    const res = await router({ path, rawBody: body, req: c.req, query: {} });
    if (res.status !== 200) {
        console.log(path, res.status, body.data);
    }
    return c.json(JSON.stringify(res.data), res.status);
});

app.get("/", async (c) => {
    //check env
    const env = envSchema.parse(process.env);
    //authentication
    const queries = insightSchema.safeParse(c.req.query());
    if (!queries.success) {
        return c.json(null, 400);
    }
    const { startDate, endDate, timeZone, websiteId, token } = queries.data;
    try {
        jwt.verify(token, env.NEXTAUTH_SECRET, (err, decoded) => {
            //@ts-ignore
            if (decoded.website !== websiteId) {
                throw Error;
            }
        });
    } catch {
        return c.json(null, 401);
    }
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const duration = endDateObj.getTime() - startDateObj.getTime();
    const pastEndDateObj = new Date(startDateObj.getTime() - duration);
    try {
        const tick = performance.now();
        let [events, lastEvents] = await retryFunction(
            getDataQuery,
            [startDateObj, endDateObj, pastEndDateObj, websiteId],
            3,
            4,
        );
        const tack = performance.now();
        console.log(tack - tick, "ms taken to query");
        const filters = JSON.parse(queries.data.filter) as Filter<LoglibEvent>[];
        filters.length &&
            filters.forEach((f) => {
                events = filter(events).where(f.key, f.operator, f.value).execute();
                lastEvents = filter(lastEvents as LoglibEvent[])
                    .where(f.key, f.operator, f.value)
                    .execute();
            });
        const insightData = getInsight(events as LoglibEvent[], lastEvents as LoglibEvent[]);
        const tableData = getTablesData(
            events as LoglibEvent[],
            startDateObj,
            endDateObj,
            timeZone,
        );
        return c.json(
            {
                insight: insightData,
                ...tableData,
            },
            200,
        );
    } catch (e) {
        console.log(e);
    }
});

//TODO: should be changed the json to be parsed from clickhouse than js
app.get("/events", async (c) => {
    const env = envSchema.parse(c.env);
    const startDateObj = new Date(c.req.query("startDate"));
    const endDateObj = new Date(c.req.query("endDate"));
    const websiteId = c.req.query("websiteId");
    const client = createClient({
        host: env.CLICKHOUSE_HOST,
        password: env.CLICKHOUSE_PASSWORD,
    });
    try {
        const res = await client
            .query({
                query: customEventsQuery(
                    convertDate(startDateObj),
                    convertDate(endDateObj),
                    websiteId,
                ),
                format: "JSONEachRow",
            })
            .then(async (res) => await res.json())
            .catch((e) => console.log(e));
        type EventRes = {
            id: string;
            event: string;
            sessionId: string;
            visitorId: string;
            properties: string;
            timestamp: string;
            websiteId: string;
        };
        const events = (res as EventRes[])
            .map((s) => {
                const properties = JSON.parse(s.properties);
                return {
                    id: s.id,
                    event: s.event,
                    sessionId: s.sessionId,
                    websiteId: s.websiteId,
                    visitorId: s.visitorId,
                    timestamp: s.timestamp,
                    ...properties,
                };
            })
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return c.json(events, 200);
    } catch {
        return c.json(null, 500);
    }
});

//api/v1
app.use("/v1/*", async (c, next) => {
    const apiKey = c.req.headers.get("x-api-key");
    if (!apiKey) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const site = await db
        .selectFrom("api_key")
        .selectAll()
        .where("key", "=", apiKey)
        .executeTakeFirst();
    if (!site) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const query = c.req.query();
    const data = apiQuery.safeParse(query);
    if (!data.success) {
        return c.json({ message: "Bad request" }, 400);
    }
    c.env.websiteId = site.websiteId;
    return await next();
});

app.get("/v1/hits", async (c) => {
    const query = c.req.query();
    console.log(query);
    const { startDate, endDate } = apiQuery.parse(query);
    const websiteId = c.env.websiteId as string;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    async function getData() {
        return await client
            .query({
                query: hitsQuery(convertToUTC(startDateObj), convertToUTC(endDateObj), websiteId),
                format: "JSONEachRow",
            })
            .then(async (res) => (await res.json()) as LoglibEvent[]);
    }
    const data = await retryFunction(getData, [], 3, 4);
    return c.json(data, 200);
});

serve(
    {
        fetch: app.fetch,
        port: 8000,
    },
    (info) => {
        console.log("listening on port: ", info.port);
    },
);
