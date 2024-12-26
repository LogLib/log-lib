import { Logger } from "./utils/logger";
import { flush, getSessionDuration, getUrlParams, getVisitorId, isDevelopment } from "./utils/util";

export function sendPageView(currentRef: string, currentUrl: string) {
    const dataToSend = {
        id: window.lli.pageId,
        path: "/hits",
        currentPath: currentUrl,
        referrerPath: currentRef,
        referrerDomain: document.referrer,
        websiteId: window.llc.id,
        host: location.href,
        sdkVersion: window.lli.sdkVersion,
        visitorId: getVisitorId(),
        sessionId: window.lli.sessionId,
        screenWidth: window.screen.width,
        language: navigator.language,
        queryParams: getUrlParams(),
        pageId: window.lli.pageId,
        duration: (Date.now() - window.lli.timeOnPage) / 1000,
    };
    send(dataToSend);
}

export function sendEvents() {
    if (window.lli.eventsBank.length) {
        const eventToSend = {
            path: "/event",
            events: window.lli.eventsBank,
            websiteId: window.llc.id,
            visitorId: getVisitorId(),
            sessionId: window.lli.sessionId,
            screenWidth: window.screen.width,
            language: navigator.language ?? "en",
        };
        send(eventToSend, flush);
    }
}

export function sendVisitor(payload: Record<string, string>) {
    const visitorToSend = {
        path: "/visitor",
        data: payload,
        websiteId: window.llc.id,
        visitorId: getVisitorId(),
        sessionId: window.lli.sessionId,
        pageId: window.lli.pageId,
        duration: getSessionDuration(),
    };
    send(visitorToSend);
}

export async function send(
    data: Record<string, any> | Array<Record<string, any>>,
    onSuccess?: () => void,
    onError?: () => void,
    path?: string,
) {
    const logger = Logger(window.llc.debug);
    const url = path ? window.llc.host + path : window.llc.host;
    if (!data || (Array.isArray(data) && data.length === 0)) {
        logger.log("skipping empty request...");
        return;
    }
    if (isDevelopment()) {
        logger.log("skipping development logs...");
        return;
    }
    logger.log("sending...", data);
    let retryCount = 0;
    const maxRetries = 3;
    async function sendRequest(host: string) {
        try {
            if (!window.llc.useBeacon) {
                await fetch(host, {
                    body: JSON.stringify(data),
                    method: "POST",
                    keepalive: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then(() => onSuccess?.());
            } else {
                navigator.sendBeacon(host, JSON.stringify(data));
                onSuccess?.();
            }
        } catch {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", host);
            xhr.setRequestHeader("Content-Type", "text/plain");
            xhr.onload = async () => {
                if (xhr.status === 200) {
                    onSuccess?.();
                } else {
                    await retry();
                }
                logger.error(xhr.statusText);
            };
            xhr.onerror = async () => {
                onError?.();
                await retry();
                logger.error("Couldn't send request to the server. See the XHR error.");
            };
            xhr.send(JSON.stringify(data));
        }
    }
    async function retry() {
        if (retryCount < maxRetries) {
            retryCount++;
            logger.log(`Retrying request. Attempt ${retryCount} of ${maxRetries}...`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
        } else {
            logger.error("Request failed after multiple retries.");
        }
    }
    if (Array.isArray(url)) {
        for (const host of url) {
            await sendRequest(host);
        }
    } else {
        await sendRequest(url);
    }
}
