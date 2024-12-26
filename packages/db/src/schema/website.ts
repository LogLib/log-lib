import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { boolean, date, id, userId } from "./utils";
import { relations } from "drizzle-orm";
import { teamMember, users } from ".";

export const website = sqliteTable(
    "website",
    {
        id: id(),
        createdAt: date("createdAt"),
        url: text("url").notNull(),
        title: text("title"),
        userId: userId(),
        active: boolean("active").default(false).notNull(),
        public: boolean("public").default(false).notNull(),
    },
    (table) => ({
        websiteUserIdx: index("website_userIdx").on(table.userId),
    }),
);

export const websiteRelations = relations(website, ({ many, one }) => {
    return {
        teamWebsites: many(teamMember),
        user: one(users, {
            fields: [website.userId],
            references: [users.id],
        }),
    };
});

export const websiteEmails = sqliteTable("emails", {
    id: id(),
    lastSent: date("lastSent"),
    sendingInterval: int("sendingInterval").default(30),
    reportInterval: int("reportInterval").default(30),
    websiteId: text("websiteId").references(() => website.id, { onDelete: "cascade" }),
});

export const websiteEmailsRelation = relations(websiteEmails, ({ one }) => {
    return {
        website: one(website, {
            fields: [websiteEmails.websiteId],
            references: [website.id],
        }),
    };
});
