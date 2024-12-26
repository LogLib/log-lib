import { VitalData } from "@loglib/types/tracker";

export type Config = {
    /** The ID of the tracker instance */
    id: string;
    /** Whether to automatically track events. Currently only supports click events with onclick handlers or clicks on a button. */
    autoTrack?: boolean;
    /** Collect web vitals for speed insights. True by default. */
    webVitals?: boolean;
    /**
     * Collect page analytics for page insights. This true by default.
     */
    pageAnalytics?: boolean;
    /**
     * custom events collected using the tracker will be ignored if you turn this off.
     */
    customEvents?: boolean;
    /** Whether to enable debug logging. */
    debug?: boolean;
    /** The environment to use for tracking. */
    env?: "auto" | "prod" | "dev";
    /** The interval (in milliseconds) for sending data to the server. */
    postInterval?: number;
    /** The hostname or array of hostnames to send data to. By default it sends to the api.loglib.io */
    host?: string | string[];
    /** The user's consent status for tracking. If not granted if uses hashed version of the user ip address as user id. If granted it store userId on local storage. By default it's denied. You can set it globally here or You can change the user consent using the setConsent method exported from the tracker.. @example import {setConsent} from "@loglib/tracker"
     * setConsent("granted") */
    consent?: "granted" | "denied";
    useServerPath?: boolean;
    useBeacon?: boolean;
};
export type ServerEvents = {
    id: string;
    eventName: string;
    eventType: string;
    payload: Record<string, string>;
    page: string;
};

export interface DomEvent extends Event {
    target: EventTarget & Element & HTMLFormElement;
}

export interface Internal {
    eventsBank: ServerEvents[];
    startTime: number;
    currentUrl: string;
    currentRef: string;
    timeOnPage: number;
    pageId: string;
    sessionId: string;
    intervals: NodeJS.Timer[];
    sdkVersion: string;
    vitalQueue: Set<VitalData>;
}

export interface InitInfo {
    pathname: string;
    host: string;
    referrer: string;
    queryParams: {
        [k: string]: string;
    };
    screenWidth: number;
    language: string;
}

declare global {
    interface Window {
        llc: Config;
        lli: Internal;
        loglib: {
            record: (config: Partial<Config>) => void;
            track: (name: string, payload?: Record<string, any>) => void;
            identify: (payload: Record<string, string>) => void;
            setConsent: (concent: "granted" | "denied") => void;
        };
    }
}
