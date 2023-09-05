import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NEXTAUTH_URL: z.string().url().optional(),
        NEXTAUTH_SECRET: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(0).optional(),
        GITHUB_CLIENT_SECRET: z.string().min(0).optional(),
        GOOGLE_CLIENT_ID: z.string().min(0).optional(),
        GOOGLE_CLIENT_SECRET: z.string().min(0).optional(),
        DATABASE_URL: z.string().optional(),
        DATABASE_AUTH_TOKEN: z.string().optional(),
        RESEND_EMAIL_SECRET: z.string().min(0).optional(),
        CLICKHOUSE_HOST: z.string().min(0).optional(),
        CLICKHOUSE_PASSWORD: z.string().min(0).optional(),
        NEXT_PUBLIC_API_URL: z.string().min(1),
        //Stripe
        STRIPE_SECRET_KEY: z.string().min(0).optional(),
        STRIPE_WEBHOOK_SECRET: z.string().min(0).optional(),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(0).optional(),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string().min(1),
        NEXT_PUBLIC_API_URL: z.string().min(1),
    },
    runtimeEnv: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        RESEND_EMAIL_SECRET: process.env.RESEND_EMAIL_SECRET,
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_USERNAME: process.env.DATABASE_USERNAME,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        CLICKHOUSE_HOST: process.env.CLICKHOUSE_HOST,
        CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
});
