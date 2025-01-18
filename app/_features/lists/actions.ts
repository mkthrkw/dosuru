"use server";

import type { ListSchemaType } from "@/app/_features/lists/schema";
import type { ActionState } from "@/app/_util/types/actionType";
import type { ListTicket } from "@/app/_util/types/nestedType";
import { prisma } from "@/prisma/prisma";
import type { List } from "@prisma/client";

/* ==================================================================
 *
 * Create
 *
================================================================== */

/**
 * 新しいリストを作成します。
 *
 * @param inputValues リストの作成に必要なデータを含むオブジェクト。
 *                    title: リストのタイトル
 *                    color: リストの色
 * @param projectId リストが属するプロジェクトのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function createList(
	inputValues: ListSchemaType,
	projectId: string,
): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.$transaction(async (tx) => {
			// 既存レコードの表示順序最大値を取得
			const maxOrder = await tx.list.aggregate({
				_max: { order: true },
				where: { projectId: projectId },
			});

			// レコードが存在しない場合は0を設定
			const order = maxOrder._max?.order || 0;

			// 新規レコードを作成
			await tx.list.create({
				data: {
					title: inputValues.title,
					color: inputValues.color,
					order: order + 1,
					projectId: projectId,
				},
			});
		});
		prevState.state = "resolved";
		prevState.message = "List created successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to create list: ${error}`;
		return prevState;
	}
}

/* ==================================================================
 *
 * List Update
 *
================================================================== */

/**
 * リストを更新します。
 *
 * @param inputValues 更新するリストのデータを含むオブジェクト。
 *                    title: リストのタイトル
 *                    color: リストの色
 * @param listId 更新するリストのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateList(
	inputValues: ListSchemaType,
	listId: string,
): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.list.update({
			where: { id: listId },
			data: {
				title: inputValues.title,
				color: inputValues.color,
			},
		});
		prevState.state = "resolved";
		prevState.message = "List updated successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to update list: ${error}`;
		return prevState;
	}
}

/* ==================================================================
 *
 * Order update
 *
================================================================== */

/**
 * プロジェクト内のリストの表示順序を更新します。
 *
 * @param lists 更新するリストの配列。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateListOrder(lists: List[]): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.$transaction(
			lists.reverse().map((list, index) =>
				prisma.list.update({
					where: { id: list.id },
					data: { order: index + 1 },
				}),
			),
		);
		prevState.state = "resolved";
		prevState.message = "Project list order updated successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to update project list order: ${error}`;
		return prevState;
	}
}

/**
 * プロジェクト内のチケットの表示順序を更新します。
 *
 * @param lists チケットを含むリストの配列。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateListTicketOrder(
	lists: ListTicket[],
): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.$transaction(
			lists.flatMap((list) =>
				list.tickets.reverse().map((ticket, index) =>
					prisma.ticket.update({
						where: { id: ticket.id },
						data: {
							order: index + 1,
							listId: list.id,
						},
					}),
				),
			),
		);
		prevState.state = "resolved";
		prevState.message = "Project ticket order updated successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to update project ticket order: ${error}`;
		return prevState;
	}
}

/* ==================================================================
 *
 * Delete
 *
================================================================== */

/**
 * リストを削除します。
 *
 * @param listId 削除するリストのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function deleteList(listId: string): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.list.delete({
			where: { id: listId },
		});
		prevState.state = "resolved";
		prevState.message = "List deleted successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to delete list: ${error}`;
		return prevState;
	}
}
