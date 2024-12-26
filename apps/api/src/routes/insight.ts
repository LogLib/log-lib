import { LoglibEvent } from "../type";

export const getInsight = (events: LoglibEvent[], pastEvents: LoglibEvent[]) => {
    const { newVisitors, returningVisitor, uniqueVisitors, bounceRate, averageTime } =
        transformData(events, pastEvents);
    const totalPageViews = {
        current: events.length,
        change: getChange(pastEvents.length, events.length),
    };
    return {
        newVisitors,
        returningVisitor,
        uniqueVisitors,
        averageTime,
        totalPageViews,
        bounceRate,
    };
};

const transformData = (events: LoglibEvent[], pastEvents: LoglibEvent[]) => {
    const uniqueValues = new Set();
    let bounces = 0;
    let duration = 0;
    for (const event of events) {
        uniqueValues.add(event.visitorId);
        event.duration < 10 && bounces++;
        duration += event.duration;
    }
    const uniqueVisitorCount = uniqueValues.size;
    const pastUniqueValues = new Set();
    let pastBounces = 0;
    let pastDuration = 0;
    for (const event of pastEvents) {
        pastUniqueValues.add(event.visitorId);
        event.duration < 10 && pastBounces++;
        pastDuration += event.duration;
    }
    const pastUniqueVisitorCount = pastUniqueValues.size;
    const newVisitors = new Set([...uniqueValues].filter((x) => !pastUniqueValues.has(x))).size;
    const returningVisitors = new Set([...uniqueValues].filter((x) => pastUniqueValues.has(x)))
        .size;
    function getAverageTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (seconds < 60) {
            return isNaN(seconds) ? "0 sec" : `${seconds} sec`;
        } else {
            return `${isNaN(minutes) ? 0 : minutes} min ${
                isNaN(remainingSeconds) ? 0 : remainingSeconds
            } sec`;
        }
    }
    return {
        uniqueVisitors: {
            current: uniqueVisitorCount,
            change: getChange(pastUniqueVisitorCount, uniqueVisitorCount),
        },
        newVisitors: {
            current: newVisitors,
            change: null,
        },
        returningVisitor: {
            current: returningVisitors,
            change: null,
        },
        bounceRate: {
            current: Math.round((bounces / events.length) * 100),
            change: getChange(pastBounces / pastEvents.length, bounces / events.length),
        },
        averageTime: {
            current: getAverageTime(Math.round(duration / events.length)),
            change: getChange(pastDuration / pastEvents.length, duration / events.length),
        },
    };
};

const getChange = (past: number, current: number): number => {
    if (past === 0 || !past) return 100;
    const change = ((current - past) / past) * 100;
    return Math.round(Math.min(change, 100));
};
