import { blob, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id } from "./utils";

export const events = sqliteTable(
    "events",
    {
        id: id(),
        event: text("event").notNull(),
        timestamp: integer("timestamp", {
            mode: "timestamp_ms",
        }).notNull(),
        sessionId: text("sessionId").notNull(),
        visitorId: text("visitorId").notNull(),
        properties: blob("properties", {
            mode: "json",
        }).$type<{
            city: string;
            country: string;
            browser: string;
            device: string;
            language: string;
            currentPath: string;
            referrerPath: string;
            referrerDomain: string;
            queryParams: string;
            duration: number;
            os: string;
        }>(),
        websiteId: text("websiteId").notNull(),
    },
    (table) => {
        return {
            websiteIdx: index("website_idx").on(table.websiteId),
        };
    },
);
