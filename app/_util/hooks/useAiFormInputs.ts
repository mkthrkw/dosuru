import { atom, useAtom } from "jotai";

const aiFormInputsAtom = atom<{ inputValue: string }>({
	inputValue: "",
});

export function useAiFormInputs() {
	const [aiFormInputs, setAiFormInputs] = useAtom(aiFormInputsAtom);
	return { aiFormInputs, setAiFormInputs };
}
