import { create } from "zustand";

export const useLlmFormStore = create<{
	inputValue: string;
	setValue: (inputValue: string) => void;
}>((set) => ({
	inputValue: "",
	setValue: (value) => set({ inputValue: value }),
}));
