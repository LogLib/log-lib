import { env } from "env.mjs";
import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";

export const resend = env.RESEND_EMAIL_SECRET ? new Resend(env.RESEND_EMAIL_SECRET) : null;

export const sendEmail = async ({
    email,
    subject,
    react,
    marketing,
    test,
}: {
    email: string;
    subject: string;
    react: ReactElement<any, string | JSXElementConstructor<any>>;
    marketing?: boolean;
    test?: boolean;
}) => {
    if (!resend) {
        console.log(
            "Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work.",
        );
        return Promise.resolve();
    }
    return resend.emails.send({
        from: marketing ? "Beka from Loglib <bekacru@loglib.io>" : "Loglib <no-reply@loglib.io>",
        to: test ? "delivered@resend.dev" : email,
        subject,
        react,
    });
};
