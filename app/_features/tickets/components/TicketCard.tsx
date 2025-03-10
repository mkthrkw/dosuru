"use client";
import { CompleteBadge } from "@/app/_features/tickets/components/CompleteBadge";
import { getDateOnlyShortStyle } from "@/app/_lib/tempo/format";
import type { Ticket } from "@prisma/client";
import { useTicketModalStore } from "../../lists/store/useTicketModalStore";

export function TicketCard({ ticket }: { ticket: Ticket }) {

  const { ticketModalOpen } = useTicketModalStore();
  const hasPeriod = ticket.startAt || ticket.endAt;

  return (
    <button
      type="button"
      onClick={() => ticketModalOpen(ticket.id)}
      className="flex flex-col text-left w-full shadow-sm rounded-xl px-3 py-2 bg-base-100 text-base-content min-h-20 overflow-y-hidden"
    >
      <div className="flex justify-between w-full">
        <div className="text-xs text-base-content/50">#{ticket.displayId}</div>
        <CompleteBadge completed={ticket.completed} />
      </div>
      <h4 className="text-xl py-1">{ticket.title}</h4>
      {hasPeriod && (
        <div className="flex text-xs text-base-content/50">
          <div className="w-10">
            期間:
          </div>
          <div className="flex justify-between w-full">
            <div>{getDateOnlyShortStyle(ticket.startAt)}</div>
            <div> 〜 </div>
            <div>{getDateOnlyShortStyle(ticket.endAt)}</div>
          </div>
        </div>
      )}
    </button>
  );
}