import z from "zod";
import { RootDashboardSchema } from "../../schema";
import { ApiGetHandler } from "../../type";
import { getBrowser, getDevices, getEvents, getLoc, getOS, getOnlineUsers, getPageViews, getPages, getReferer, getUniqueVisitors, getVisitorsByDate } from "./utils";
import { EventsWithData, getAverageTime, getBounceRate } from "./utils/analysis";
import { GenericError, PageView, Session } from "../../..";
import { filter } from "./filter/smallFilter";
import { Filter } from "./filter/type";

export type GetInsightQuery = z.infer<typeof getInsightSchema>

export type GetInsightResponse = {
    insight: {
        uniqueVisitors: {
            total: number,
            change: number
        },
        pageView: {
            total: number,
            change: number
        },
        averageTime: {
            total: string,
            change: number
        },
        bounceRate: {
            total: number,
            change: number
        },

    },
    data: {
        pages: {
            page: string,
            visits: number
        }[],
        devices: {
            device: string,
            visits: number
        }[],
        referrer: {
            referrer: string;
            visits: number;
            referrerDomain: string;
        }[],
        locations: {
            city: {
                location: string;
                visits: number;
            }[],
            country: {
                location: string;
                visits: number;
            }[]
        },
        os: {
            os: string;
            visits: number;
        }[],
        browser: {
            browser: string;
            visits: number;
        }[]
    },
    graph: {
        uniqueVisitorsByDate: {
            date: string;
            visits: number;
        }[],
        uniqueSessionByDate: {
            date: string;
            visits: number;
        }[]
    },
    onlineUsers: number,
    eventsWithData: EventsWithData
}

const getInsightSchema = RootDashboardSchema.merge(z.object({
    startDate: z.string(),
    endDate: z.string(),
    timeZone: z.string(),
    filter: z.string(),
    websiteId: z.string().optional()
}))


export const getDashboardData: ApiGetHandler<GetInsightQuery, GetInsightResponse> = async (req, options) => {
    const adapter = options.adapter
    const query = getInsightSchema.safeParse(req.query)
    if (query.success) {
        try {
            const { startDate, endDate, timeZone, websiteId } = query.data
            const startDateObj = new Date(startDate)
            const endDateObj = new Date(endDate)
            const duration = endDateObj.getTime() - startDateObj.getTime()
            const pastEndDateObj = new Date(startDateObj.getTime() - duration)
            let users = await adapter.getUser(startDateObj, endDateObj, websiteId)
            let pastUsers = await adapter.getUser(pastEndDateObj, startDateObj, websiteId)
            let pageViews = await adapter.getPageViews(startDateObj, endDateObj, websiteId)
            let pastPageViews = await adapter.getPageViews(pastEndDateObj, startDateObj, websiteId)
            let sessions = await adapter.getSession(startDateObj, endDateObj, websiteId)
            let pastSessions = await adapter.getSession(pastEndDateObj, startDateObj, websiteId)
            let events = await adapter.getEvents(startDateObj, endDateObj, websiteId)

            //filters
            const filters = JSON.parse(query.data.filter) as Filter<Session, "session">[] | Filter<PageView, "pageview">[]
            filters.forEach((f) => {
                if (f.data === "session") {
                    sessions = filter(sessions).where(f.key, f.operator, f.value).execute()
                    pastSessions = filter(pastSessions).where(f.key, f.operator, f.value).execute()
                    pageViews = pageViews.filter((p) => {
                        const session = sessions.filter((s) => s.id === p.sessionId)
                        return session.length > 0
                    })
                    pastPageViews = pastPageViews.filter((p) => {
                        const session = pastSessions.filter((s) => s.id === p.sessionId)
                        return session.length > 0
                    })
                    users = users.filter((u) => {
                        const session = sessions.filter((s) => s.userId === u.id)
                        return session.length > 0
                    })
                    pastUsers = pastUsers.filter((u) => {
                        const session = pastSessions.filter((s) => s.userId === u.id)
                        return session.length > 0
                    })
                    events = events.filter((e) => {
                        const session = sessions.filter((s) => s.id === e.sessionId)
                        return session.length > 0
                    })
                } else if (f.data === "pageview") {
                    pageViews = filter(pageViews).where(f.key, f.operator, f.value).execute()
                    pastPageViews = filter(pastPageViews).where(f.key, f.operator, f.value).execute()
                    sessions = sessions.filter((s) => {
                        const pageView = pageViews.filter((p) => p.sessionId === s.id)
                        return pageView.length > 0
                    })
                    pastSessions = pastSessions.filter((s) => {
                        const pageView = pastPageViews.filter((p) => p.sessionId === s.id)
                        return pageView.length > 0
                    })
                    users = users.filter((u) => {
                        const session = sessions.filter((s) => s.userId === u.id)
                        return session.length > 0
                    })
                    pastUsers = pastUsers.filter((u) => {
                        const session = pastSessions.filter((s) => s.userId === u.id)
                        return session.length > 0
                    })
                    events = events.filter((e) => {
                        const session = sessions.filter((s) => s.id === e.sessionId)
                        return session.length > 0
                    })
                }
            })

            //insights data
            const uniqueVisitors = getUniqueVisitors(users, pastUsers)
            const pageView = getPageViews(pageViews, pastPageViews)
            const averageTime = getAverageTime(sessions, pastSessions, pageViews, pastPageViews)
            const bounceRate = getBounceRate(pageViews, pastPageViews, sessions, pastSessions)
            const pages = getPages(pageViews)
            const devices = getDevices(sessions)
            const referrer = getReferer(sessions)
            const locations = {
                city: getLoc(sessions, false),
                country: getLoc(sessions)
            }
            const os = getOS(sessions)
            const browser = getBrowser(sessions)
            const uniqueVisitorsByDate = getVisitorsByDate(sessions, startDateObj, endDateObj, true, timeZone)
            const uniqueSessionByDate = getVisitorsByDate(sessions, startDateObj, endDateObj, false, timeZone)
            const onlineUsers = getOnlineUsers(sessions)
            const eventsWithData = getEvents(events, sessions, pageViews)
            return {
                message: 'success',
                code: 200,
                data: {
                    insight: {
                        uniqueVisitors,
                        pageView,
                        averageTime,
                        bounceRate,
                    },
                    data: {
                        pages,
                        devices,
                        referrer,
                        locations,
                        os,
                        browser
                    },
                    graph: {
                        uniqueVisitorsByDate,
                        uniqueSessionByDate,
                    },
                    onlineUsers,
                    eventsWithData
                }
            }
        } catch (e) {
            console.error(e)
            throw new GenericError('Error getting insight data', { path: "/insights" })
        }
    }
    else {
        throw new Error('Invalid request query param')
    }
}