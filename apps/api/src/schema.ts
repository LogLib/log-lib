import { convertDate } from "./lib/utils";
import { z } from "zod";

export const insightSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    websiteId: z.string(),
    timeZone: z.string(),
    filter: z.string().default("[]"),
    token: z.string(),
});

export const insightPubApiSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    timeZone: z.string().optional(),
    filter: z.string().default("[]"),
    apiKey: z.string(),
});

export const rootTrackerSchema = z.object({
    pageId: z.string(),
    sessionId: z.string(),
    visitorId: z.string().optional(),
    websiteId: z.string(),
});

export const envSchema = z.object({
    CLICKHOUSE_HOST: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string(),
    NEXTAUTH_SECRET: z.string(),
});

export const sessionSchema = z.object({
    id: z.string(),
    createdAt: z.string().transform((x) => convertDate(x)),
    updatedAt: z.string().transform((x) => convertDate(x)),
    totalDuration: z.number(),
    queryParams: z.string(),
    referrer: z.string(),
    country: z.string().nullable(),
    city: z.string().nullable(),
    language: z.string(),
    device: z.string(),
    os: z.string(),
    browser: z.string(),
    visitorId: z.string(),
    websiteId: z.string(),
});

export const pageviewSchema = z.object({
    id: z.string(),
    createdAt: z.string().transform((x) => convertDate(x)),
    totalDuration: z.number(),
    page: z.string(),
    referrer: z.string(),
    queryParams: z.string(),
    sessionId: z.string(),
    visitorId: z.string(),
    websiteId: z.string(),
});

export const eventSchema = z.object({
    id: z.string(),
    createdAt: z.string().transform((x) => convertDate(x)),
    eventName: z.string(),
    eventType: z.string(),
    payload: z.string(),
    pageId: z.string(),
    sessionId: z.string(),
    visitorId: z.string(),
    websiteId: z.string(),
});

export const visitorSchema = z.object({
    id: z.string(),
    websiteId: z.string(),
    createdAt: z.string(),
    data: z.string(),
});

//api v1
export const apiQuery = z.object({
    startDate: z.string(),
    endDate: z.string(),
});

export const ingestQuerySchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    websiteId: z.string(),
    email: z.string(),
    timezone: z.string(),
});
