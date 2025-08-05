import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { schema } from "@/db/schema"; // your schema definition
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import VerificationEmail from "@/components/emails/verification-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
        await resend.emails.send({
        from: "LightNote <onboarding@lightnote.page>",
        to: [user.email],
        subject: "Verify your email",
        react: VerificationEmail({
          userName: user.email,
          verificationUrl: url,
        }),
      });
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  plugins: [nextCookies()],
});
