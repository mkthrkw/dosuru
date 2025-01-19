"use server";

import { executeWorkflow } from "@/app/_lib/dify/actions";
import type { ActionState } from "@/app/_util/types/actionType";
import { createList } from "../lists/actions";
import { createProject } from "../projects/actions";
import { createTicket } from "../tickets/actions";
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
	try {
		const data = await executeWorkflow({
			query: inputValues.second_input,
			phase: "second_input",
		});
		const response: ProjectResponse = await JSON.parse(data);

		// プロジェクト作成
		const createProjectResult = await createProject({
			name: response.project.title,
			description: response.project.description,
		});

		const projectId = createProjectResult.createdId;
		if (!projectId) throw new Error("can't create project.");

		// リスト作成
		response.project.lists
			.reverse()
			.map(async (list: { title: string; tickets: { title: string }[] }) => {
				const color = ["#93aec1", "#9dbdba", "#f8b042", "#ec6a52"][
					Math.floor(Math.random() * 4)
				];
				const createListResult = await createList(
					{
						title: list.title,
						color: color,
					},
					projectId,
				);

				const listId = createListResult.createdId;
				if (!listId) throw new Error("can't create list.");

				// チケット作成
				list.tickets.reverse().map(async ({ title }) => {
					await createTicket(
						{
							title: title,
						},
						listId,
					);
				});
			});

		prevState.state = "resolved";
		prevState.message = projectId;
		return prevState;
	} catch (error) {
		prevState.state = "rejected";
		prevState.message = `Failed to create project by AI: ${error}`;
		return prevState;
	}
}
