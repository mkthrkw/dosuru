"use server";

import type { AuthSchemaType } from "@/app/_features/auth/schema";
import type { ActionState } from "@/app/_util/types/actionType";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

/**
 * ユーザーをログインさせます。
 *
 * @param formData ログインに必要なメールアドレスとパスワードを含むオブジェクト。
 * @returns ログイン処理の状態とメッセージを含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 *          リダイレクトエラーの場合は、エラーを返さずにログイン成功として扱います。
 */
export async function login(formData: AuthSchemaType): Promise<ActionState> {
	const prevState: ActionState = {
		state: "pending",
		message: "",
	};
	try {
		await signIn("credentials", formData);
		prevState.state = "resolved";
		return prevState;
	} catch (error) {
		// リダイレクトエラーの場合、エラーを返さずにログイン成功として扱う
		if (isRedirectError(error)) {
			prevState.state = "resolved";
			prevState.message = "Login successful";
			return prevState;
		}
		// ログインエラーの場合、エラーメッセージを表示
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					prevState.message = "Incorrect Email or Password";
					break;
				default:
					prevState.message = "Login failed. Please try again.";
			}
		} else {
			prevState.message = "An unexpected error occurred.";
		}
		prevState.state = "rejected";
		return prevState;
	}
}

/**
 * ユーザーをログアウトさせ、ログインページへリダイレクトします。
 *
 * @returns {Promise<void>}
 */
export async function logout() {
	await signOut();
	redirect("/login");
}
