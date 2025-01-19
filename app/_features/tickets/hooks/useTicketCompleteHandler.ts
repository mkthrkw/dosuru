import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useTicketModalStore } from "../../lists/store/useTicketModalStore";
import { updateTicketCompleted } from "../actions";

export function useTicketCompleteHandler() {
	const { ticketModalProps, partialUpdateTicketModalProps } =
		useTicketModalStore();

	const [completed, setCompleted] = useState(
		ticketModalProps?.completed ?? false,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const handleToggle = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const message = `このチケットを${completed ? "未完了" : "完了"}しますか？`;
			if (!ticketModalProps || !window.confirm(message)) {
				event?.preventDefault();
				return;
			}
			setIsSubmitting(true);
			const result = await updateTicketCompleted(
				!completed,
				ticketModalProps.id,
			);
			if (result.state === "resolved") {
				setCompleted(!completed);
				partialUpdateTicketModalProps({ completed: !completed });
				router.refresh();
			} else if (result.state === "rejected") {
				toast.error(result.message || "An error occurred", {
					autoClose: 3000,
				});
			}
			setIsSubmitting(false);
		},
		[completed, ticketModalProps, partialUpdateTicketModalProps, router],
	);

	return { completed, setCompleted, handleToggle, isSubmitting };
}
