"use server";

import { ActionState } from "@/app/_util/types/actionType";
import { CommentSchemaType } from "./schema";
import { prisma } from "@/prisma/prisma";

/* ==================================================================
 *
 * Create
 *
================================================================== */

/**
 * 新しいコメントを作成します。
 *
 * @param inputValues コメントの作成に必要なデータを含むオブジェクト。
 *                    text: コメントのテキスト
 * @param ticketId コメントが属するチケットのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function createComment(
  inputValues: CommentSchemaType,
  ticketId: string,
): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    await prisma.comment.create({
      data: {
        text: inputValues.text,
        ticketId: ticketId,
      },
    });
    prevState.state = "resolved";
    prevState.message = "Comment created successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to create comment: ${error}`;
    return prevState;
  }
}

/* ==================================================================
 *
 * Update
 *
================================================================== */

/**
 * コメントを更新します。
 *
 * @param inputValues 更新するコメントのデータを含むオブジェクト。
 *                    text: コメントのテキスト
 * @param commentId 更新するコメントのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateComment(
  inputValues: CommentSchemaType,
  commentId: string,
): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text: inputValues.text,
      },
    });
    prevState.state = "resolved";
    prevState.message = "Comment updated successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to update comment: ${error}`;
    return prevState;
  }
}

/* ==================================================================
 *
 * Delete
 *
================================================================== */

/**
 * コメントを削除します。
 *
 * @param commentId 削除するコメントのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function deleteComment(commentId: string): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    prevState.state = "resolved";
    prevState.message = "Comment deleted successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to delete comment: ${error}`;
    return prevState;
  }
}
