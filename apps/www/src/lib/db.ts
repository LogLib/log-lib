import { createClient } from "@libsql/client";
import { schema } from "@loglib/db";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "env.mjs";
import path from "path";

export const getDbUrl = () => {
    if (process.env.NODE_ENV === "production") {
        if (!env.DATABASE_URL) {
            throw Error("❌ DATABASE URL MISSING");
        }
        return env.DATABASE_URL;
    }
    if (env.DATABASE_URL) {
        return env.DATABASE_URL;
    }
    const workDir = path.dirname(process.cwd());
    const re = /(\\+|\/)/g;
    const dir = workDir.split(re);
    const dbPath = `file:${dir.slice(0, dir.length - 2).join("/")}/packages/db/db.sqlite`;
    console.log("⌗ [Database]:", dbPath);
    return dbPath;
};

const client = createClient({
    url: getDbUrl(),
    authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
    schema,
});
