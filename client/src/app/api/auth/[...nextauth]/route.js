import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import api from "../../../../lib/axios";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "my_super_secret_key_123",
  callbacks: {
    async jwt({ token, account }) {
      // Always call backend if Google login just happened
      if (account && account.provider === "google") {
        try {
          const res = await api.post("/auth/google", {
            token: account.id_token,
          });
          const { data } = res.data;
          token.backendJWT = data?.token;
          token.user = data?.user;
        } catch (error) {
          console.error("Error during backend authentication:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Only use backend user and token
      session.backendJWT = token.backendJWT;
      session.user = token.user;
      return session;
    },
  },
});

export const { GET, POST } = handlers;
