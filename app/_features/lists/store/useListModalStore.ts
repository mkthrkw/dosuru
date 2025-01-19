import type { List } from "@prisma/client";
import { create } from "zustand";

type ModalProps = {
	isListModalOpen: boolean;
	listModalProps: List | null;
	listModalOpen: (list: List) => void;
	listModalClose: () => void;
};

export const useListModalStore = create<ModalProps>((set) => ({
	isListModalOpen: false,
	listModalProps: null,
	listModalOpen: (list) => set({ isListModalOpen: true, listModalProps: list }),
	listModalClose: () => set({ isListModalOpen: false, listModalProps: null }),
}));
