import type { NextAuthConfig } from "next-auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./auth-route";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma/prisma";

export const authConfig = {
  adapter: PrismaAdapter(prisma), // データベースアダプター
  pages: {
    signIn: "/login", // カスタムログインページ
  },
  session: {
    strategy: "jwt", // セッションの保存方法
    maxAge: 60 * 60 * 24 * 7, // 7日間
    updateAge: 60 * 60 * 24, // 毎日更新
  },
  secret: process.env.AUTH_SECRET, // セキュリティのための秘密鍵
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // ユーザーがログインしているかどうか
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname); // パブリックルートかどうか
      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // API認証ルートかどうか
      const isAuthRoute = authRoutes.includes(nextUrl.pathname); // 認証ルートかどうか

      // パブリックルートには常にアクセスを許可
      if (isPublicRoute) return true;
      // API認証ルートには常にアクセスを許可
      if (isApiAuthRoute) return true;
      // ログインしていない人が認証ルートにアクセスした場合は許可
      if (!isLoggedIn && isAuthRoute) {
        return true;
      }
      // ログインしている人が認証ルートにアクセスした場合はリダイレクト
      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      // それ以外はログインしていれば許可
      // ログインしていなければリダイレクト
      return isLoggedIn;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  redirectProxyUrl: DEFAULT_LOGIN_REDIRECT,
} satisfies NextAuthConfig;
