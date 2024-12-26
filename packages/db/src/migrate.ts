import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

async function main() {
    const arg1 = process.env.DATABASE_URL ?? "file:./db.sqlite";
    const arg2 = process.env.DATABASE_AUTH_TOKEN;
    console.log("⌗ Starting Migration", "[Database]:", arg1, "[Auth Token]:", arg2);
    const client = createClient({
        url: arg1,
        authToken: arg2,
    });
    const db = drizzle(client);
    await migrate(db, {
        migrationsFolder: "./migrations",
    });
}

main()
    .then(() => {
        console.log("✅: [Migration Complete]");
    })
    .catch((e) => {
        console.log(e, "❗️:[Migration Failed]");
    });
