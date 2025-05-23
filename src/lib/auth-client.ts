import { createAuthClient } from "better-auth/react";

const isProduction = process.env.NODE_ENV === "production";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: isProduction
    ? process.env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000",
});

export const { signIn, signOut } = authClient;
