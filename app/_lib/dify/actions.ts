"use server";

/**
 * チャットメッセージを送信します。
 *
 * @param {Object} options - チャットメッセージのオプション。
 * @param {string} options.query - チャットメッセージのクエリ。
 * @param {string} options.phase - チャットメッセージのフェーズ。
 * @returns {Promise<string>} - チャットメッセージの送信結果を返します。
 */
export async function executeWorkflow({
	query,
	phase,
}: {
	query: string;
	phase: string;
}) {
	const response = await fetch(`${process.env.DIFY_BASE_URL}/chat-messages`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
		},
		body: JSON.stringify({
			inputs: { phase: phase },
			query: query,
			response_mode: "blocking",
			conversation_id: "",
			user: "dosuru",
		}),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	const data = await response.json();
	return data.answer;
}
