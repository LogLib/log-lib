import { Resend } from "resend";
import { ReactElement } from "react";
import IngestEmail from "./emails/ingest-email";
import React from "react";
import { GetInsightResponse } from "@loglib/types";

export class Emails {
    private readonly apiKey: string | undefined;
    private readonly resend: Resend | undefined;
    constructor(opts: { apiKey?: string }) {
        this.apiKey = opts.apiKey;
        if (this.apiKey) {
            this.resend = new Resend(this.apiKey);
        }
    }

    public async sendEmail({
        email,
        subject,
        react,
        marketing,
        test,
    }: {
        email: string;
        subject: string;
        react: ReactElement<any, string>;
        marketing?: boolean;
        test?: boolean;
    }) {
        if (!this.resend) {
            console.log(
                "Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work.",
            );
            return Promise.resolve();
        }
        return this.resend.emails.send({
            from: marketing
                ? "Beka from Loglib <bekacru@loglib.io>"
                : "Loglib <no-reply@loglib.io>",
            to: test ? "delivered@resend.dev" : email,
            subject,
            react,
        });
    }

    public sendIngestedEmail(opts: {
        to: string;
        website: {
            title: string;
            id: string;
        };
        stats: GetInsightResponse["insight"];
        topPages: GetInsightResponse["data"]["pages"];
    }) {
        return this.sendEmail({
            email: opts.to,
            subject: `${opts.website.title} summary on loglib`,
            react: (
                <IngestEmail
                    website={opts.website}
                    stats={opts.stats}
                    email={opts.to}
                    topPages={opts.topPages}
                />
            ),
        });
    }
}
