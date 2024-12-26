import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { date, id, userId } from "./utils";
import { website } from "./website";

export const apiKey = sqliteTable(
    "apiKey",
    {
        id: id(),
        userId: userId(),
        name: text("name").notNull(),
        websiteId: text("websiteId").references(() => website.id, { onDelete: "cascade" }),
        token: text("token").notNull().unique(),
        expiresAt: date("expiresAt"),
        createdAt: date("createdAt"),
        updatedAt: date("updatedAt"),
    },
    (table) => ({
        userIdx: index("user_idx").on(table.userId),
    }),
);
