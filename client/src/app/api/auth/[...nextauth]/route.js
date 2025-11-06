import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "../../../../lib/axios";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Allow traditional email/password via backend /auth/login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });
          const data = res.data?.data;
          // return an object that will be available as `user` in callbacks
          return {
            id: data?.user?.id,
            name: data?.user?.name,
            email: data?.user?.email,
            backendJWT: data?.token,
          };
        } catch (err) {
          console.error("Credentials authorize error", err?.response?.data || err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "my_super_secret_key_123",
  callbacks: {
    async jwt({ token, account, user }) {
      // If Google provider just signed in, exchange id_token with backend
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

      // If credentials provider returned a user object with backendJWT, store it
      if (user) {
        if (user.backendJWT) token.backendJWT = user.backendJWT;
        // user may already contain id/name/email
        token.user = token.user || {
          id: user.id,
          name: user.name,
          email: user.email,
        };
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
