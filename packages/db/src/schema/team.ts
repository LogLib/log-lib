import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users, website } from ".";
import { boolean, date, id, userId } from "./utils";

export const team = sqliteTable("team", {
    id: id(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    image: text("image"),
    createdAt: date("createdAt"),
    updatedAt: date("updatedAt"),
});

export const teamMember = sqliteTable("teamMember", {
    id: id(),
    userId: userId(),
    email: text("email").notNull(),
    name: text("name"),
    teamId: text("teamId").references(() => team.id, { onDelete: "cascade" }),
    websiteId: text("websiteId").references(() => website.id, {
        onDelete: "cascade",
    }),
    accepted: boolean("accepted").default(false),
    role: text("text", {
        enum: ["owner", "admin", "viewer"],
    }),
    createdAt: date("createdAt"),
    updatedAt: date("updatedAt"),
});

export const teamInvitation = sqliteTable("teamInvitation", {
    id: id(),
    email: text("email").notNull(),
    teamId: text("teamId").references(() => team.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    status: text("status", {
        enum: ["pending", "accepted", "rejected", "expired"],
    }),
    userId: userId(),
    teamMemberId: text("teamMemberId").references(() => teamMember.id, {
        onDelete: "cascade",
    }),
    createdAt: date("createdAt"),
    updatedAt: date("updatedAt"),
});

export const teamWebsites = sqliteTable("teamWebsites", {
    id: id(),
    createdAt: date("createdAt"),
    updatedAt: date("updatedAt"),
    teamId: text("teamId").references(() => team.id, { onDelete: "cascade" }),
    websiteId: text("websiteId").references(() => website.id, {
        onDelete: "cascade",
    }),
});

export const teamWebsitesRelations = relations(teamWebsites, ({ one }) => {
    return {
        team: one(team, {
            fields: [teamWebsites.teamId],
            references: [team.id],
        }),
        website: one(website, {
            fields: [teamWebsites.websiteId],
            references: [website.id],
        }),
    };
});
export const teamMemberRelations = relations(teamMember, ({ one }) => {
    return {
        team: one(team, {
            fields: [teamMember.teamId],
            references: [team.id],
        }),
        website: one(website, {
            fields: [teamMember.websiteId],
            references: [website.id],
        }),
        users: one(users, {
            fields: [teamMember.userId],
            references: [users.id],
        }),
    };
});

export const teamRelations = relations(team, ({ many }) => {
    return {
        teamMembers: many(teamMember),
        teamWebsites: many(teamWebsites),
    };
});
