import { type Config } from "drizzle-kit";

const config: Config = {
    out: "./migrations",
    schema: "./src/schema",
    breakpoints: true,
    driver: "turso",
    dbCredentials: {
        url: process.env.DATABASE_URL ?? "file:./db.sqlite",
        authToken: process.env.DATABASE_AUTH_TOKEN,
    },
};
export default config;
