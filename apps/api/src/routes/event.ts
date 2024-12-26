import { browserName, detectOS } from "detect-browser";
import { z } from "zod";
import { eventDB } from "../db";
import { client } from "../db/clickhouse";
import { apiResponse } from "../lib/api-response";
import { checkUsage } from "../lib/check-usage";
import { getDevice } from "../lib/detect/get-device";
import { getIpAddress } from "../lib/detect/get-ip-address";
import { getLocation } from "../lib/detect/get-location";
import { setVisitorId } from "../lib/set-visitor-id";
import { RouteType } from "./type";

export const eventSchema = z.object({
    events: z.array(
        z.object({
            id: z.string(),
            eventName: z.string(),
            eventType: z.string(),
            payload: z.record(z.any()).optional(),
            page: z.string(),
            referrerPath: z.string(),
            referrerDomain: z.string(),
            duration: z.number().default(0),
            pageId: z.string().optional(),
            queryParams: z.record(z.any()),
        }),
    ),
    sessionId: z.string(),
    visitorId: z.string().optional(),
    websiteId: z.string(),
    screenWidth: z.number(),
    language: z.string(),
});

export const createEvents: RouteType = async ({ rawBody, req }) => {
    const body = eventSchema.safeParse(rawBody);
    if (body.success) {
        const ipAddress = getIpAddress(req);
        const { visitorId, websiteId, sessionId, language, events, screenWidth } = body.data;
        const usage = checkUsage(websiteId);
        if (!usage) {
            return;
        }
        const { city, country } = await getLocation(ipAddress, req);
        const userAgent = req.headers["user-agent"] ?? "unknown";
        const browser = browserName(userAgent) ?? "unknown";
        const os = detectOS(userAgent) ?? "Mac OS";
        const device = getDevice(screenWidth, os);
        events.map(async (event) => {
            await client.insert({
                table: "loglib.event",
                values: {
                    id: event.id,
                    sessionId,
                    visitorId: setVisitorId(visitorId, ipAddress),
                    websiteId,
                    event: event.eventName ?? "custom",
                    properties: JSON.stringify({
                        payload: event.payload ?? {},
                        currentPath: event.page,
                        referrerPath: event.referrerPath,
                        referrerDomain: event.referrerDomain,
                        type: event.eventType,
                        queryParams: event.queryParams ? JSON.stringify(event.queryParams) : "{}",
                        pageId: event.pageId,
                        city,
                        country,
                        duration: event.duration,
                        browser,
                        os,
                        device,
                        language: language ?? "en",
                    }),
                    sign: 1,
                },
                format: "JSONEachRow",
            });
            await eventDB.insertEvent({
                id: event.id,
                sessionId,
                visitorId: setVisitorId(visitorId, ipAddress),
                websiteId,
                event: event.eventName ?? "custom",
                payload: JSON.stringify(event.payload),
                currentPath: event.page,
                referrerPath: event.referrerPath,
                referrerDomain: event.referrerDomain,
                type: event.eventType,
                queryParams: event.queryParams ? JSON.stringify(event.queryParams) : "{}",
                pageId: event.pageId,
                city,
                country,
                duration: event.duration,
                browser,
                os,
                device,
                language: language ?? "en",
                timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
            });
        });
        return {
            data: {
                message: "successfully created events",
            },
            status: 200,
        };
    } else {
        return apiResponse.badRequest;
    }
};
