import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { authSchema } from "./app/_features/auth/schema";
import bcrypt from "bcrypt";
import { getUserByEmail } from "@/app/_features/user/actions";
import { cache } from "react";

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    // Credentialsはbcryptがmiddlewareで使えないため、authConfigに含めることが出来ない
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = authSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return user; // ログイン成功
          }
        }
        return null; // ログイン失敗
      },
    }),
  ],
});

const auth = cache(uncachedAuth);
export { auth, handlers, signIn, signOut };
