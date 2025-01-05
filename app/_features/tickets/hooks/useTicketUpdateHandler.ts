import { findFirstDifferenceKey, pickObject } from "@/app/_util/helper/object";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputTicketUpdateSchemaType,
  OutputTicketUpdateSchemaType,
  ticketUpdateSchema,
} from "../schema";
import { TicketComment } from "@/app/_util/types/nestedType";
import { updateTicket } from "../actions";

export function useTicketUpdateHandler({
  modalProps,
  stateUpdateFunction,
}: {
  modalProps: TicketComment | null;
  stateUpdateFunction?: (inputValues: Partial<OutputTicketUpdateSchemaType>) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<InputTicketUpdateSchemaType, undefined, OutputTicketUpdateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(ticketUpdateSchema),
  });

  const onBlur = useCallback(
    async (inputValues: OutputTicketUpdateSchemaType) => {
      if (!modalProps) return;

      const diffKey = findFirstDifferenceKey<OutputTicketUpdateSchemaType, TicketComment>(
        inputValues,
        modalProps,
      );
      if (!diffKey) return;
      const targetParam = pickObject(inputValues, [diffKey]);

      const result = await updateTicket(targetParam, modalProps.id);
      if (result.state === "resolved") {
        if (stateUpdateFunction) stateUpdateFunction(targetParam);
      }
      if (result.state === "rejected") {
        toast.error(result.message || "An error occurred", {
          autoClose: 3000,
        });
      }
    },
    [modalProps, stateUpdateFunction],
  );

  return {
    register,
    handleSubmit: handleSubmit(onBlur),
    errors,
    isSubmitting,
    setValue,
  };
}
