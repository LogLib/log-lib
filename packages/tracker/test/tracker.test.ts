import { Mock, vi } from "vitest";
import { navigationHandler, record } from "../src/record";
import { send, sendEvents, sendPageView } from "../src/server";
import { flush, getSessionDuration, getVisitorId } from "../src/utils/util";
import { setConsent, track } from "../src/methods";

const mocks = vi.hoisted(() => {
    return {
        guid: vi.fn(),
        getSessionDuration: vi.fn().mockReturnValue(1),
    };
});

vi.mock("../src/server");
vi.mock("../src/utils/util", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const actual = (await vi.importActual(
        "../src/utils/util",
    )) as typeof import("../src/utils/util");
    return {
        ...actual,
        guid: mocks.guid,
        getSessionDuration: mocks.getSessionDuration,
    };
});

beforeEach(() => {
    vi.useFakeTimers();
    vi.resetAllMocks();
    // Clear the events bank before each test
});

afterEach(() => {
    // Clear the intervals after each test
    window.lli.intervals.forEach(clearInterval);
    window.lli.intervals = [];
    window.lli.eventsBank = [];
    vi.useRealTimers();
});

describe("Session Start", () => {
    it("should set default config if no config is provided", () => {
        record();
        expect(window.llc.debug).toBe(false);
        expect(window.llc.autoTrack).toBe(false);
        expect(window.llc.env).toBe("dev");
        expect(window.llc.postInterval).toBe(5);
        expect(window.llc.consent).toBe("denied");
    });

    it("should set provided config if config is provided", () => {
        record({ debug: true, autoTrack: true });
        expect(window.llc.debug).toBe(true);
        expect(window.llc.autoTrack).toBe(true);
    });
});

describe("should send pageview when navigating to new page", () => {
    beforeEach(() => {
        window.lli = {
            currentRef: "",
            currentUrl: "",
            eventsBank: [],
            pageId: "",
            timeOnPage: 0,
            startTime: 0,
            sessionId: "123",
            intervals: [],
            sdkVersion: "0.4.3",
        };
    });
    it("should update currentRef and currentUrl with the new url", () => {
        const url = "/new-page";
        const currentUrl = window.lli.currentUrl;
        navigationHandler("", "", url);
        expect(window.lli.currentRef).toBe(currentUrl);
        expect(window.lli.currentUrl).toBe(url);
    });

    it("should send data", () => {
        const url = "https://example.com";
        const currentRef = "https://example.com/old";
        const currentUrl = "https://example.com/new";
        window.lli.currentRef = currentRef;
        window.lli.currentUrl = currentUrl;
        const events = [
            {
                eventType: "click",
                eventName: "Click",
                id: "123",
                page: "/",
                payload: { foo: "bar" },
            },
        ];
        window.lli.eventsBank = events;
        navigationHandler("", "", url);
        expect(sendEvents).toHaveBeenCalled();
        expect(sendPageView).toHaveBeenCalled();
    });
});

describe("should send data on visibility change", () => {
    it("should send session end info on session end", () => {
        record();
        const eventBank = [
            {
                eventName: "direct",
                eventType: "click",
                payload: {},
                id: "123",
                page: "/test",
            },
        ];
        window.lli.eventsBank = eventBank;
        (send as Mock).mockClear();
        (send as Mock).mockImplementation((_, __, fn?: () => void) => {
            fn?.();
        });
        const event = new Event("visibilitychange", { bubbles: true });
        Object.defineProperty(document, "visibilityState", {
            value: "hidden",
            writable: true,
        });
        vi.mocked(getSessionDuration).mockReturnValue(1);
        document.dispatchEvent(event);
        expect(sendPageView).toHaveBeenCalled();

        expect(sendEvents).toHaveBeenCalled();
        const event2 = new Event("visibilitychange", { bubbles: true });
        Object.defineProperty(document, "visibilityState", {
            value: "visible",
            writable: true,
        });
        document.dispatchEvent(event2);
    });
});

describe("events", () => {
    it("should increase the event bank if auto click is on if a btn or element with onClick function is clicked", () => {
        record({ autoTrack: true });
        const button = document.createElement("button");
        const notABtn = document.createElement("div");
        const notABtnButHasOnClick = document.createElement("div");
        button.innerHTML = "test";
        document.body.appendChild(button);
        document.body.appendChild(notABtn);
        document.body.appendChild(notABtnButHasOnClick);
        button.onclick = () => {
            console.log("clicked");
        };
        notABtnButHasOnClick.onclick = () => {
            console.log("clicked");
        };
        button.click();
        notABtn.click();
        notABtnButHasOnClick.click();
        expect(window.lli.eventsBank.length).toBe(2);
        window.llc.autoTrack = false;
        button.click();
        expect(window.lli.eventsBank.length).toBe(2);
        track("test", {
            name: "test",
        });
        expect(window.lli.eventsBank.length).toBe(3);
        document.body.removeChild(button);
    });

    it("Should send events when the post interval is reached", () => {
        record({ autoTrack: true, postInterval: 1 });
        const button = document.createElement("button");
        button.innerHTML = "test";
        document.body.appendChild(button);
        button.click();
        expect(window.lli.eventsBank.length).toBe(1);
        vi.advanceTimersByTime(1000);
        expect(sendEvents).toHaveBeenCalled();
        document.body.removeChild(button);
    });
});

describe("Concent", () => {
    it("should not set userId if concent is denied which is default", () => {
        record();
        expect(window.llc.consent).toBe("denied");
        expect(getVisitorId()).toBe("");
    });

    it("should change concent on setConcent", () => {
        setConsent("granted");
        expect(window.llc.consent).toBe("granted");
        expect(getVisitorId()).not.toBe("");
    });

    it("If there is user id in local storage, it should set it as userId", () => {
        record();
        expect(window.llc.consent).toBe("denied");
        window.localStorage.setItem("loglib-id", "123");
        expect(getVisitorId()).toBe("123");
    });
});
