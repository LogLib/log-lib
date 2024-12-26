import { schema } from "@loglib/db";

export type Website = typeof schema.website.$inferSelect;
export type ApiKey = typeof schema.apiKey.$inferSelect;
export type Team = typeof schema.team.$inferSelect;
export type TeamMember = typeof schema.teamMember.$inferSelect;
export type TeamWebsite = typeof schema.teamWebsites.$inferSelect;
export type TeamInvitation = typeof schema.teamInvitation.$inferSelect;
export type User = typeof schema.users.$inferSelect;

//ENUMS
export type ROLE = NonNullable<typeof schema.teamMember.$inferSelect.role>;

export type Visitor = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    data: Record<string, any>;
    websiteId?: string | null;
};

export type Session = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    queryParams: Record<string, any> | null;
    referrer: string;
    duration: number;
    country: string | null;
    city: string | null;
    language: string | null;
    device: string | null;
    os: string | null;
    browser: string | null;
    visitorId: string;
    websiteId?: string | null;
};

export type PageView = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    page: string;
    referrer: string;
    queryParams: Record<string, string> | null;
    duration: number;
    sessionId: string;
    visitorId: string;
    websiteId?: string | null;
};

export type Events = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    eventName: string;
    eventType: string;
    payload: Record<string, any> | null;
    pageId: string;
    sessionId: string;
    visitorId: string;
    websiteId?: string | null;
};
