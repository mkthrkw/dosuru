"use server";

import type {
	OutputTicketUpdateSchemaType,
	TicketCreateSchemaType,
} from "@/app/_features/tickets/schema";
import type { ActionState } from "@/app/_util/types/actionType";
import type { TicketComment } from "@/app/_util/types/nestedType";
import { prisma } from "@/prisma/prisma";

/* ==================================================================
 *
 * Create
 *
================================================================== */

/**
 * チケットを作成します。
 *
 * @param inputValues 作成するチケットデータを含むオブジェクト。
 * @param listId チケットが属するリストのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function createTicket(
	inputValues: TicketCreateSchemaType,
	listId: string,
): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.$transaction(async (tx) => {
			// 既存レコードの表示順序最大値を取得
			const maxOrder = await tx.ticket.aggregate({
				_max: { order: true },
				where: { listId: listId },
			});
			// リストIDからプロジェクトIDを取得
			const targetList = await tx.list.findUnique({
				where: {
					id: listId,
				},
				select: {
					projectId: true,
				},
			});
			if (!targetList?.projectId) throw new Error("Project ID not found.");

			// 同じプロジェクトに紐づくチケットの最大displayIDを取得
			const maxDisplayId = await tx.ticket.aggregate({
				_max: { displayId: true },
				where: {
					list: {
						projectId: targetList.projectId,
					},
				},
			});

			// レコードが存在しない場合は0を設定
			const order = maxOrder._max?.order || 0;
			const displayId = maxDisplayId._max?.displayId || 0;

			// 新規レコードを作成
			await tx.ticket.create({
				data: {
					title: inputValues.title,
					order: order + 1,
					displayId: displayId + 1,
					listId: listId,
				},
			});
		});
		prevState.state = "resolved";
		prevState.message = "Ticket created successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to create ticket: ${error}`;
		return prevState;
	}
}

/* ==================================================================
 *
 * Read
 *
================================================================== */

/**
 * 指定されたIDのチケットとそのコメントを取得します。
 *
 * @param ticketId 取得するチケットのID。
 * @returns チケットデータとコメントを含む `TicketComment` 型のオブジェクトをPromiseで返します。
 *          チケットが見つからない場合は `null` を返します。
 * @throws 取得に失敗した場合は、エラーをthrowします。
 */
export async function getTicketNestedData(
	ticketId: string,
): Promise<TicketComment | null> {
	try {
		const ticket = await prisma.ticket.findUnique({
			where: { id: ticketId },
			include: {
				comments: {
					orderBy: { createdAt: "desc" },
				},
			},
		});
		return ticket;
	} catch (error) {
		console.error(`Failed to get ticket data: ${error}`);
		throw new Error(`Failed to get ticket data: ${error}`);
	}
}

/* ==================================================================
 *
 * Update
 *
================================================================== */

/**
 * 指定されたIDのチケットを更新します。
 *
 * @param partialParams 更新するチケットのデータ。`OutputTicketUpdateSchemaType` の部分型である必要があります。
 * @param ticketId 更新するチケットのID。
 * @returns 更新後のアクション状態を含む `ActionState` オブジェクトを返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateTicket(
	partialParams: Partial<OutputTicketUpdateSchemaType>,
	ticketId: string,
): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.ticket.update({
			where: { id: ticketId },
			data: partialParams,
		});
		prevState.state = "resolved";
		prevState.message = "Ticket updated successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to update ticket: ${error}`;
		return prevState;
	}
}

/**
 * 指定されたIDのチケットの完了状態を更新します。
 *
 * @param completed チケットの完了状態 (`true` または `false`)。
 * @param ticketId 更新するチケットのID。
 * @returns 更新後のアクション状態を含む `ActionState` オブジェクトを返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateTicketCompleted(
	completed: boolean,
	ticketId: string,
): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.ticket.update({
			where: { id: ticketId },
			data: { completed: completed },
		});
		prevState.state = "resolved";
		prevState.message = "Ticket updated successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to update ticket: ${error}`;
		return prevState;
	}
}

/* ==================================================================
 *
 * Delete
 *
================================================================== */

/**
 * 指定されたIDのチケットを削除します。
 *
 * @param ticketId 削除するチケットのID。
 * @returns 削除後のアクション状態を含む `ActionState` オブジェクトを返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function deleteTicket(ticketId: string): Promise<ActionState> {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		await prisma.ticket.delete({
			where: { id: ticketId },
		});
		prevState.state = "resolved";
		prevState.message = "Ticket deleted successfully.";
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to delete ticket: ${error}`;
		return prevState;
	}
}
