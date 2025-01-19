"use client";
import { useListModalStore } from "@/app/_features/lists/store/useListModalStore";
import { TicketCreateForm } from "@/app/_features/tickets/forms/CreateForm";
import { Droppable } from "@/app/_lib/dnd_kit/Droppable";
import { Sortable } from "@/app/_lib/dnd_kit/Sortable";
import type { ListTicket } from "@/app/_util/types/nestedType";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon } from "@heroicons/react/24/outline";
import type { Ticket } from "@prisma/client";
import { TicketCard } from "../../tickets/components/TicketCard";

export function ListCard({
  list,
}: {
  list: ListTicket,
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const { listModalOpen } = useListModalStore();

  return (
    <div className="flex-none w-screen lg:w-72 px-2 lg:px-0">
      <div
        ref={setNodeRef}
        style={style}
        className="bg-base-300 shadow-sm rounded-xl"
      >
        {/* Drag handle */}
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={"w-full h-5 rounded-t-xl text-xs text-center content-center text-white"}
          style={{ backgroundColor: list.color }}
        >:::</div>
        {/* Top menu */}
        <div className="flex justify-between mb-2 border-b-2 mt-2 mx-2 px-2 border-base-content/50">
          <h2 className="text-xl">{list.title}</h2>
          <div className='tooltip tooltip-right' data-tip="リストの編集">
            <div
              onClick={() => listModalOpen(list)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  listModalOpen(list);
                }
              }}
              className="hover:bg-base-content/20 hover:cursor-pointer p-1 rounded-md"
            >
              <Bars3Icon className="w-6 h-6 text-base-content" />
            </div>
          </div>
        </div>
        <TicketCreateForm listId={list.id} />
        {/* Ticket column */}
        <SortableContext items={list.tickets} key={list.id} id={list.id}>
          <Droppable key={list.id} id={list.id}>
            <div className="min-h-[70vh] flex flex-col gap-2 p-2">
              {list.tickets.map((ticket: Ticket) => (
                <Sortable key={ticket.id} id={ticket.id}>
                  <TicketCard ticket={ticket} />
                </Sortable>
              ))}
            </div>
          </Droppable>
        </SortableContext>
      </div>
    </div>
  );
}