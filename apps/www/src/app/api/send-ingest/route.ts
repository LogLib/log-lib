import { db } from "@/lib/db";
import { schema } from "@loglib/db";
import { env } from "env.mjs";

export async function POST(_: Request) {
    const allSites = await db.query.website.findMany({
        with: {
            user: true,
        },
    });
    const sitesEmails = await db.query.websiteEmails.findMany();
    const sentSites: { websiteId: string; email: string }[] = [];
    for (const site of allSites) {
        const siteEmail = sitesEmails.find((s) => s.websiteId === site.id);
        if (siteEmail) {
            const lastSent = siteEmail.lastSent as Date;
            const sendingInterval = siteEmail.sendingInterval as number;
            const shouldSend = isAboveInterval(lastSent, sendingInterval);
            if (shouldSend && site.active) {
                const apiUrl = `${env.NEXT_PUBLIC_API_URL}/send-ingest`;
                try {
                    fetch(apiUrl, {
                        method: "POST",
                        body: JSON.stringify({
                            websiteId: site.id,
                            email: site.user.email,
                            timezone: "UTC",
                        }),
                        headers: {
                            "x-api-key": env.NEXTAUTH_SECRET,
                        },
                    });
                    sentSites.push({ websiteId: site.id, email: site.user.email });
                } catch (e) {
                    console.error(e);
                }
            }
        } else {
            await db.insert(schema.websiteEmails).values({
                lastSent: new Date(),
                websiteId: site.id,
            });
        }
    }
    return new Response(JSON.stringify({ sent: sentSites }), { status: 200 });
}

function isAboveInterval(lastSent: Date, interval: number): boolean {
    const today = new Date(); // Current date
    const intervalMilliseconds = interval * 24 * 60 * 60 * 1000; // Interval in milliseconds

    const differenceMilliseconds = today.getTime() - lastSent.getTime();

    return differenceMilliseconds > intervalMilliseconds;
}
