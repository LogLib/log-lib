import { browserName, detectOS } from "detect-browser";
import isbot from "isbot";
import { z } from "zod";
import { eventDB } from "../db";
import { apiResponse } from "../lib/api-response";
import { checkUsage } from "../lib/check-usage";
import { getDevice } from "../lib/detect/get-device";
import { getIpAddress } from "../lib/detect/get-ip-address";
import { getLocation } from "../lib/detect/get-location";
import { setVisitorId } from "../lib/set-visitor-id";
import { RouteType } from "./type";

export const schema = z.object({
    id: z.string(),
    currentPath: z.string(),
    referrerPath: z.string(),
    duration: z.number(),
    referrerDomain: z.string(),
    queryParams: z.record(z.any()),
    language: z.string(),
    screenWidth: z.number(),
    sessionId: z.string(),
    visitorId: z.string(),
    host: z.string(),
    websiteId: z.string(),
    sdkVersion: z.string(),
});

export type HitsRouteSchema = z.infer<typeof schema>;

/**
 *
 * this the main hits endpoint for the tracker from version 0.5
 */

export const createHits: RouteType = async ({ req, rawBody }) => {
    if (isbot(req.headers["user-agent"])) {
        return { data: { message: "bot" }, status: 200 };
    }
    try {
        const body = schema.safeParse(rawBody);
        if (!body.success) {
            return apiResponse.badRequest;
        }
        const {
            websiteId,
            sessionId,
            host,
            id,
            screenWidth,
            language,
            referrerDomain,
            referrerPath,
            currentPath,
            queryParams,
            duration,
        } = body.data;
        const usage = checkUsage(websiteId);
        if (!usage) {
            return;
        }
        const ref = !referrerDomain || referrerDomain.includes(host) ? "direct" : referrerDomain;
        const ip = getIpAddress(req);
        const { city, country } = await getLocation(ip, req);
        const userAgent = (req.headers["user-agent"] as string) ?? "unknown";
        const browser = browserName(userAgent) ?? "unknown";
        const os = detectOS(userAgent) ?? "Mac OS";
        const device = os ? getDevice(screenWidth, os) ?? "desktop" : "unknown";
        const visitorId = setVisitorId(body.data.visitorId, ip);
        const res = await eventDB.insertEvent({
            id,
            sessionId,
            visitorId,
            websiteId,
            event: "hits",
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
            queryParams: queryParams ? JSON.stringify(queryParams) : "{}",
            referrerDomain: ref,
            country,
            city,
            language,
            device,
            os,
            browser,
            duration,
            currentPath,
            referrerPath,
        });
        return {
            status: 200,
            data: {
                ...res,
                country,
                city,
                referrerDomain,
                referrerPath,
                currentPath,
                language,
                screenWidth,
                queryParams,
                duration,
                sessionId,
                visitorId,
            },
        };
    } catch (e) {
        console.log(e, "error hits");
        return {
            status: 500,
            data: {
                message: "internal server error",
            },
        };
    }
};
