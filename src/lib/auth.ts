import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.DB_URL as string);
const db = client.db("helpinghandsdb");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

        },
    },
    plugins: [
        jwt(),
    ],
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60
        }
    }
});
