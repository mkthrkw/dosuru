import { findFirstDifferenceKey, pickObject } from "@/app/_util/helper/object";
import type { TicketComment } from "@/app/_util/types/nestedType";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTicketModalStore } from "../../lists/store/useTicketModalStore";
import { updateTicket } from "../actions";
import {
	type InputTicketUpdateSchemaType,
	type OutputTicketUpdateSchemaType,
	ticketUpdateSchema,
} from "../schema";

export function useTicketUpdateHandler() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm<
		InputTicketUpdateSchemaType,
		undefined,
		OutputTicketUpdateSchemaType
	>({
		mode: "onBlur",
		resolver: zodResolver(ticketUpdateSchema),
	});

	const router = useRouter();
	const { ticketModalProps, partialUpdateTicketModalProps } =
		useTicketModalStore();

	const onBlur = useCallback(
		async (inputValues: OutputTicketUpdateSchemaType) => {
			if (!ticketModalProps) return;

			const diffKey = findFirstDifferenceKey<
				OutputTicketUpdateSchemaType,
				TicketComment
			>(inputValues, ticketModalProps);
			if (!diffKey) return;
			const targetParam = pickObject(inputValues, [diffKey]);

			const result = await updateTicket(targetParam, ticketModalProps.id);
			if (result.state === "resolved") {
				partialUpdateTicketModalProps(targetParam);
				router.refresh();
			}
			if (result.state === "rejected") {
				toast.error(result.message || "An error occurred", {
					autoClose: 3000,
				});
			}
		},
		[ticketModalProps, partialUpdateTicketModalProps, router],
	);

	return {
		register,
		handleSubmit: handleSubmit(onBlur),
		errors,
		isSubmitting,
		setValue,
	};
}
