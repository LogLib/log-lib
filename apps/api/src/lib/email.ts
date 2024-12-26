import { Emails } from "@loglib/email";
import { env } from "../../env";

export const mail = new Emails({ apiKey: env.RESEND_EMAIL_SECRET });
