export interface VitalData {
    visitorId: string;
    sessionId: string;
    websiteId: string;
    sdkVersion: string;
    screenWidth: number;
    language: string;
    queryParams: Record<string, string>;
    currentPath: string;
    id: string;
    delta: number;
    value: number;
    name: string;
    rating: "good" | "needs-improvement" | "poor";
    navigationType: string;
}

export interface VitalDateWithSession {
    visitorId: string;
    sessionId: string;
    websiteId: string;
    language: string;
    queryParams: Record<string, string>;
    currentPath: string;
    id: string;
    delta: number;
    value: number;
    name: string;
    rating: "good" | "needs-improvement" | "poor";
    navigationType: string;
    city: string;
    country: string;
    browser: string;
    os: string;
    device: string;
    timestamp: Date;
}
