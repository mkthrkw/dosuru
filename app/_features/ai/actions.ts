"use server";

import { executeWorkflow } from "@/app/_lib/dify/actions";
import { retroPop, tuttiFrutti } from "@/app/_util/colors/colorPalette";
import type { ActionState } from "@/app/_util/types/actionType";
import { prisma } from "@/prisma/prisma";
import { getSessionUserId } from "../user/actions";
import type { AiFirstInputSchemaType, AiSecondInputSchemaType } from "./schema";

/**
 * AIによってタスクを分解します。
 *
 * @param {string} inputValues.first_input - タスクを分解するための最初の入力。
 * @returns {Promise<ActionState>} - 分解されたタスクの状態を含むActionStateオブジェクトを返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function breakDownTheTaskByAi({
	inputValues,
}: {
	inputValues: AiFirstInputSchemaType;
}) {
	const prevState: ActionState = { state: "pending", message: "" };
	try {
		const response = await executeWorkflow({
			query: inputValues.first_input,
			phase: "first_input",
		});
		prevState.state = "resolved";
		prevState.message = response;
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to break down the task by AI: ${error}`;
		return prevState;
	}
}

/**
 * プロジェクトの応答を表す型です。
 *
 * @property {Object} project - プロジェクトの詳細を含むオブジェクト。
 * @property {string} project.title - プロジェクトのタイトル。
 * @property {string} project.description - プロジェクトの説明。
 * @property {Array} project.lists - プロジェクトに属するリストの配列。
 * @property {Object} project.lists.title - リストのタイトル。
 * @property {Array} project.lists.tickets - リストに属するチケットの配列。
 * @property {Object} project.lists.tickets.title - チケットのタイトル。
 */
type ProjectResponse = {
	project: {
		title: string;
		description: string;
		lists: Array<{
			title: string;
			tickets: Array<{ title: string }>;
		}>;
	};
};

/**
 * AIによってプロジェクトを作成します。
 *
 * @param {string} inputValues.second_input - プロジェクトを作成するための第二の入力。
 * @returns {Promise<ActionState>} - プロジェクトの状態を含むActionStateオブジェクトを返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function createProjectByAi({
	inputValues,
}: {
	inputValues: AiSecondInputSchemaType;
}) {
	const prevState: ActionState = { state: "pending", message: "" };
	const getColor = () => {
		return tuttiFrutti.concat(retroPop)[Math.floor(Math.random() * 10)];
	};
	try {
		const data = await executeWorkflow({
			query: inputValues.second_input,
			phase: "second_input",
		});
		const response: ProjectResponse = await JSON.parse(data);

		const userId = await getSessionUserId();

		const project = await prisma.$transaction(async (tx) => {
			// 既存プロジェクトレコードの表示順序最大値を取得
			const maxOrder = await tx.project.aggregate({
				_max: { order: true },
				where: { userId: userId },
			});
			// レコードが存在しない場合は0を設定
			const maxProjectOrder = maxOrder._max?.order || 0;

			// カウントアップ、ダウン用
			let displayId = 1;
			let listOrder = response.project.lists.length;

			// プロジェクトを作成
			const project = await tx.project.create({
				data: {
					name: response.project.title,
					description: response.project.description,
					order: maxProjectOrder + 1,
					userId: userId,
					lists: {
						create: response.project.lists.map((list) => {
							let ticketOrder = list.tickets.length;
							const listData = {
								title: list.title,
								order: listOrder,
								color: getColor(),
								tickets: {
									create: list.tickets.map((ticket) => {
										const ticketData = {
											title: ticket.title,
											order: ticketOrder,
											displayId: displayId,
										};
										displayId++;
										ticketOrder--;
										return ticketData;
									}),
								},
							};
							listOrder--;
							return listData;
						}),
					},
				},
			});
			return project;
		});

		prevState.state = "resolved";
		prevState.message = "Project created successfully.";
		prevState.createdId = project.id;
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to create project by AI: ${error}`;
		return prevState;
	}
}
