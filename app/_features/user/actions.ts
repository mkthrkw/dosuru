"use server";

import { uploadImage } from "@/app/_lib/cloudinary/actions";
import { ActionState } from "@/app/_util/types/actionType";
import { CreateUserSchemaType, UpdateUserProfileSchemaType } from "@/app/_features/user/schema";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { prisma } from "@/prisma/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/* ==================================================================
 *
 * Create
 *
================================================================== */

/**
 * 新しいユーザーを作成します。
 *
 * @param prevState アクション前の状態。
 * @param inputValues ユーザーの作成に必要なデータを含むオブジェクト。
 *                    name: ユーザー名
 *                    email: ユーザーのメールアドレス
 *                    password: ユーザーのパスワード
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function createUser(inputValues: CreateUserSchemaType): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    // パスワードをハッシュ化
    const saltRounds = 10; // セキュリティレベル（10-12推奨）
    const hashedPassword = await bcrypt.hash(inputValues.password, saltRounds);
    await prisma.user.create({
      data: {
        name: inputValues.name,
        email: inputValues.email,
        password: hashedPassword, // ハッシュ化されたパスワードを保存
      },
    });
    prevState.state = "resolved";
    prevState.message = "User created successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to create user: ${error}`;
    return prevState;
  }
}

/* ==================================================================
 *
 * Read
 *
================================================================== */

/**
 * 現在のセッションからユーザーIDを取得します。
 *
 * @returns ユーザーID、またはユーザーがログインしていない場合はundefinedを返します。
 * @throws ログイン情報の取得に失敗した場合にエラーをスローします。
 */
export async function getSessionUserId(): Promise<string> {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id;
  if (!userId) {
    throw new Error("Failed to get login information.");
  }
  return userId;
}

/**
 * メールアドレスに基づいてユーザーを検索します。
 *
 * @param email 検索するユーザーのメールアドレス。
 * @returns ユーザーが見つかった場合はユーザーオブジェクト、見つからなかった場合はnullを返します。
 * @throws ユーザーの取得に失敗した場合にエラーをスローします。
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user: : ${error}`);
  }
}

/**
 * 現在のセッションのユーザーインスタンスを取得します。
 *
 * @returns ユーザーが見つかった場合はユーザーオブジェクト、見つからなかった場合はnullを返します。
 * @throws ユーザーの取得に失敗した場合にエラーをスローします。
 */
export async function getUserInstance(): Promise<User | null> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      throw new Error("Failed to get login information.");
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user: : ${error}`);
  }
}

/* ==================================================================
 *
 * Update
 *
================================================================== */

/**
 * ユーザープロファイルを更新します。
 *
 * @param inputValues 更新するユーザーデータを含むオブジェクト。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateUserProfile(
  inputValues: UpdateUserProfileSchemaType,
): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    const userId = await getSessionUserId();
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: inputValues.name,
        email: inputValues.email,
      },
    });
    prevState.state = "resolved";
    prevState.message = "User updated successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to update user: ${error}`;
    return prevState;
  }
}

/**
 * ユーザーのアバター画像を更新します。
 *
 * @param fileString アップロードする画像のファイル文字列。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateUserAvatar(fileString: string): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    const userId = await getSessionUserId();
    const results = await uploadImage(fileString, userId, userId);
    await prisma.user.update({
      where: { id: userId },
      data: {
        image: results.secure_url,
      },
    });
    revalidatePath("/dosuru");
    prevState.state = "resolved";
    prevState.message = "User avatar updated successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to update user: ${error}`;
    return prevState;
  }
}
