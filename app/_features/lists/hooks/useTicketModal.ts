import { getTicketNestedData } from "@/app/_features/tickets/actions";
import { TicketComment } from "@/app/_util/types/nestedType";
import { useRef, useState } from "react";

export const useTicketModal = () => {
  const ticketDialog = useRef<HTMLDialogElement>(null);
  const [ticketModalProps, setTicketModalProps] = useState<TicketComment | null>(null);

  const setTicketNestedData = async (ticketId: string) => {
    const ticketNestedData = await getTicketNestedData(ticketId);
    if (ticketNestedData?.startAt) {
      ticketNestedData.startAt = new Date(ticketNestedData.startAt);
    }
    if (ticketNestedData?.endAt) {
      ticketNestedData.endAt = new Date(ticketNestedData.endAt);
    }
    setTicketModalProps(ticketNestedData);
  };
  const handleTicketModalOpen = (ticketId: string) => {
    setTicketNestedData(ticketId);
    ticketDialog.current?.showModal();
  };
  const updateTicketModalProps = (props: Partial<TicketComment>) => {
    setTicketModalProps((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...props,
        updated_at: new Date(),
      };
    });
  };

  return {
    ticketDialog,
    ticketModalProps,
    updateTicketModalProps,
    handleTicketModalOpen,
    setTicketNestedData,
  };
};
