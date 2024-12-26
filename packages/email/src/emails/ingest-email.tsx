import React from "react";
import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import { GetInsightResponse } from "@loglib/types";
import { Footer } from "../component/footer";

interface IngestedEmailProps {
    website: {
        title: string;
        id: string;
    };
    email: string;
    stats: GetInsightResponse["insight"];
    topPages: GetInsightResponse["data"]["pages"];
}

const siteUrl = "https://loglib.io";

const IngestEmail = ({
    website = {
        title: "Loglib",
        id: "loglib",
    },
    topPages = [
        {
            page: "/",
            visits: 123,
        },
        {
            page: "/marketing",
            visits: 530,
        },
        {
            page: "/s/loglib",
            visits: 340,
        },
    ],
    email = "test@loglib.io",
    stats = {
        uniqueVisitors: {
            current: 1000,
            change: 40,
        },
        newVisitors: {
            current: 450,
            change: -35,
        },
        returningVisitor: {
            current: 450,
            change: 20,
        },
        totalPageViews: {
            current: 430,
            change: 48,
        },
        averageTime: {
            current: "32 Sec",
            change: -45,
        },
        bounceRate: {
            current: 30,
            change: 50,
        },
    },
}: IngestedEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your 30-day loglib summary for {website.title}</Preview>
            <Tailwind>
                <Body className="m-auto bg-white font-sans">
                    <Container className="mx-auto my-[40px]  w-[465px]  rounded border border-solid border-[#eaeaea] p-[20px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={
                                    "https://vgssydupjvshgeeeqjvo.supabase.co/storage/v1/object/public/images/Logo%20(5).png"
                                }
                                width="60"
                                height="57"
                                alt="Loglib"
                                className="mx-auto my-0 rounded-sm"
                            />
                        </Section>
                        <Heading className="mx-0 my-[30px] p-0 text-center text-[18px] font-normal text-black">
                            A summary of {website.title} analytics.
                        </Heading>
                        <Text className="text-[14px] leading-[24px] text-black">
                            Hey there, here is a summary of {website.title} stats from the past{" "}
                            <strong>30 days.</strong>
                        </Text>
                        <Section>
                            <Stat
                                name="Unique Visitors"
                                change={stats.uniqueVisitors.change}
                                current={nCommaFormat(stats.uniqueVisitors.current)}
                            />
                            <Stat
                                name="Average Time"
                                change={stats.averageTime.change}
                                current={stats.averageTime.current}
                            />
                            <Stat
                                name="Page Views"
                                change={stats.totalPageViews.change}
                                current={nCommaFormat(stats.totalPageViews.current)}
                            />
                            <Stat
                                name="Bounce Rate"
                                change={stats.bounceRate.change}
                                current={`${stats.bounceRate.current}%`}
                            />
                        </Section>
                        {topPages.length > 0 && (
                            <>
                                <Text className="text-sm leading-6 text-black">
                                    Here are your top {topPages.length} best performing pages:
                                </Text>
                                <Section>
                                    <Row className="pb-2">
                                        <Column align="left" className="text-sm text-gray-500">
                                            Page
                                        </Column>
                                        <Column align="right" className="text-sm text-gray-500">
                                            Visits
                                        </Column>
                                    </Row>
                                    {topPages.map(({ page, visits }, index) => (
                                        <div key={page}>
                                            <Row>
                                                <Column
                                                    align="left"
                                                    className="text-sm font-medium"
                                                >
                                                    {truncate(page, 30)}
                                                </Column>
                                                <Column
                                                    align="right"
                                                    className="text-sm text-gray-600"
                                                >
                                                    {nFormatter(visits)}
                                                </Column>
                                            </Row>
                                            {index !== topPages.length - 1 && (
                                                <Hr className="my-2 w-full border border-gray-200" />
                                            )}
                                        </div>
                                    ))}
                                </Section>
                            </>
                        )}
                        <Section className="my-[32px] text-center">
                            <Text className=" text-sm leading-6 text-black">
                                You can view your full stats by clicking the button below.
                            </Text>
                            <Button
                                pX={20}
                                pY={12}
                                className="rounded bg-[#000000] cursor-pointer text-center text-[12px] font-semibold text-white no-underline"
                                href={`${siteUrl}/s/${website.id}`}
                            >
                                Go To Dashboard
                            </Button>
                        </Section>
                        <Footer email={email} />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export const Stat = ({
    name,
    current,
    change,
}: { name: string; change: number; current: string | number }) => {
    return (
        <Row style={{ marginTop: "10px" }}>
            <Column>
                <Text style={title}>{name}</Text>
                {change > 0 ? (
                    <Row className=" flex items-center gap-2">
                        <svg
                            viewBox="0 0 24 24"
                            width={14}
                            height={14}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                {" "}
                                <rect width="24" height="24" fill="none"></rect>{" "}
                                <path
                                    d="M12 18L12 6M12 6L7 11M12 6L17 11"
                                    stroke="#008000"
                                    strokeLinecap="round"
                                    stroke-linejoin="round"
                                ></path>{" "}
                            </g>
                        </svg>
                        <span
                            style={{
                                fontSize: "12px",
                                color: "#008000",
                            }}
                        >
                            {change}%
                        </span>
                    </Row>
                ) : (
                    <Row className=" flex items-center gap-2">
                        <svg
                            viewBox="0 0 24 24"
                            width={14}
                            height={14}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                {" "}
                                <rect width="24" height="24" fill="none"></rect>{" "}
                                <path
                                    d="M12 6L12 18M12 18L17 13M12 18L7 13"
                                    stroke="#000000"
                                    strokeLinecap="round"
                                    stroke-linejoin="round"
                                ></path>{" "}
                            </g>
                        </svg>
                        <span
                            style={{
                                fontSize: "12px",
                            }}
                        >
                            {change}%
                        </span>
                    </Row>
                )}
            </Column>
            <Column
                style={{
                    display: "table-cell",
                    padding: "0px 20px 0px 0px",
                    width: "100px",
                    verticalAlign: "top",
                }}
                align="right"
            >
                <Text
                    style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        margin: "0",
                    }}
                >
                    {current}
                </Text>
            </Column>
        </Row>
    );
};

const resetText = {
    margin: "0",
    padding: "0",
    lineHeight: 1.4,
};

const title = { fontSize: "14px", fontWeight: "600", ...resetText };

export default IngestEmail;

export function nCommaFormat(num?: number) {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const truncate = (str: string | null, length: number) => {
    if (!str || str.length <= length) return str;
    return `${str.slice(0, length - 3)}...`;
};

export function nFormatter(num?: number, digits?: number) {
    if (!num) return "0";
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol : "0";
}
