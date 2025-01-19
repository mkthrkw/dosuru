import type { TicketComment } from "@/app/_util/types/nestedType";
import { create } from "zustand";
import { getTicketNestedData } from "../../tickets/actions";

/**
 * チケットのモーダルプロップデータを取得する関数です。
 * @param {string} ticketId - チケットのID
 * @returns {Promise<TicketComment>} チケットのネストされたデータ
 */
const getTicketModalPropsData = async (
	ticketId: string,
): Promise<TicketComment | null> => {
	const ticketNestedData = await getTicketNestedData(ticketId);
	// 開始日と終了日が指定されている場合は、Dateオブジェクトに変換します。
	if (ticketNestedData?.startAt) {
		ticketNestedData.startAt = new Date(ticketNestedData.startAt);
	}
	if (ticketNestedData?.endAt) {
		ticketNestedData.endAt = new Date(ticketNestedData.endAt);
	}
	return ticketNestedData;
};

type TicketModalState = {
	isTicketModalOpen: boolean;
	ticketModalProps: TicketComment | null;
	setTicketModalProps: (ticketId: string) => void;
	partialUpdateTicketModalProps: (params: Partial<TicketComment>) => void;
	ticketModalOpen: (ticketId: string) => void;
	ticketModalClose: () => void;
};

export const useTicketModalStore = create<TicketModalState>()((set) => ({
	isTicketModalOpen: false,
	ticketModalProps: null,
	setTicketModalProps: async (ticketId: string) => {
		set({ ticketModalProps: await getTicketModalPropsData(ticketId) });
	},
	partialUpdateTicketModalProps: async (params: Partial<TicketComment>) => {
		set((state) => {
			if (!state.ticketModalProps) return state;
			return {
				...state,
				ticketModalProps: {
					...state.ticketModalProps,
					...params,
					updatedAt: new Date(),
				},
			};
		});
	},
	ticketModalOpen: async (ticketId: string) => {
		set({
			isTicketModalOpen: true,
			ticketModalProps: await getTicketModalPropsData(ticketId),
		});
	},
	ticketModalClose: () =>
		set({ isTicketModalOpen: false, ticketModalProps: null }),
}));
