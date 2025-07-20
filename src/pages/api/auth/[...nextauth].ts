// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import ZitadelProvider from "next-auth/providers/oidc";

const handler = NextAuth({
  providers: [
    ZitadelProvider({
      id: "zitadel",
      name: "Tailscale",
      clientId: process.env.ZITADEL_CLIENT_ID!,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET!,
      issuer: process.env.ZITADEL_ISSUER!,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
