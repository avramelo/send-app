import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "web3",
      name: "Web3",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message || !credentials?.signature) {
            throw new Error("Missing message or signature");
          }

          const siwe = new SiweMessage(JSON.parse(credentials.message));

          const result = await siwe.verify({
            signature: credentials.signature,
          });

          if (!result.success) {
            throw new Error("Invalid signature");
          }

          return {
            id: siwe.address,
            address: siwe.address,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, credentials }) {
      try {
        if (!credentials?.message || !credentials?.signature) {
          console.warn("Missing credentials");
          throw new Error("Missing credentials");
        }
        if (!user) {
          console.warn("No user returned from authorize");
          throw new Error("Authentication failed");
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user = {
        address: token.sub,
      };
      session.address = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.address;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

export default NextAuth(authOptions);
