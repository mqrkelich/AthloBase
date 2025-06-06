import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "@/lib/auth.config"
import { db } from "@/lib/db";

import {getUserById} from "@/data/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture ?? null;
      }

      return session;
    },
    async jwt({ token }) {
      if (token.sub) {
        const dbUser = await getUserById(token.sub);

        if (dbUser) {
          token.sub = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image ?? null;
        }
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})