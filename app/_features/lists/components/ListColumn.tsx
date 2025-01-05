"use client";
import { ListCard } from './ListCard';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createContext, useEffect, useState } from 'react';
import { customClosestCorners } from '@/app/_lib/dnd_kit/customClosestCorners';
import { TicketCard } from '@/app/_features/tickets/components/TicketCard';
import {
  getMovedLists,
  getMovedTicketsOtherContainer,
  getMovedTicketsSameContainer,
  updateMovedLists,
  updateMovedTickets
} from '@/app/_lib/dnd_kit/actions';
import { ListCreateForm } from '../forms/CreateForm';
import { ListUpdateForm } from '../forms/UpdateForm';
import { TicketUpdateForm } from '@/app/_features/tickets/forms/UpdateForm';
import { useListModal } from '../hooks/useListModal';
import { useTicketModal } from '../hooks/useTicketModal';
import { ListTicket, ProjectListTicket } from '@/app/_util/types/nestedType';
import { Ticket } from '@prisma/client';


export const OpenTicketModalContext = createContext<(_ticketId: string) => void>(() => { });
export const SetTicketNestedDataContext = createContext<(_ticketId: string) => void>(() => { });

export function ListColumn({ projectListTicket }: { projectListTicket: ProjectListTicket }) {
  const [lists, setLists] = useState<ListTicket[]>(projectListTicket.lists);
  const [activeTicket, setActiveTicket] = useState<Ticket | undefined>();

  const { listDialog, listModalProps, handleListModalOpen } = useListModal();
  const { ticketDialog, ticketModalProps, updateTicketModalProps, handleTicketModalOpen, setTicketNestedData } = useTicketModal();

  useEffect(() => {
    if (lists === projectListTicket.lists) return;
    setLists(projectListTicket.lists);
  }, [projectListTicket.lists, lists]);

  const customSensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        collisionDetection={(args) => customClosestCorners(args, projectListTicket)}
        sensors={customSensors}
        id={projectListTicket.id}
      >
        <SortableContext
          items={lists}
          id={projectListTicket.id}
          key={projectListTicket.id}
        >
          <OpenTicketModalContext.Provider value={handleTicketModalOpen}>
            {lists.map((list) => (
              <ListCard list={list} key={list.id} handleListModalOpen={handleListModalOpen} />
            ))}
          </OpenTicketModalContext.Provider>
        </SortableContext>
        {activeTicket && (
          <DragOverlay>
            <TicketCard ticket={activeTicket} />
          </DragOverlay>
        )}
      </DndContext>
      <div className="absolute bottom-3 right-3">
        <ListCreateForm projectId={projectListTicket.id} />
      </div>
      <ListUpdateForm modalProps={listModalProps} dialog={listDialog} />
      <SetTicketNestedDataContext.Provider value={setTicketNestedData}>
        <TicketUpdateForm modalProps={ticketModalProps} updateProps={updateTicketModalProps} dialog={ticketDialog} />
      </SetTicketNestedDataContext.Provider>
    </>
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveTicket(lists.flatMap((list) => list.tickets).find((ticket) => ticket.id === event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    if (event.active.data.current?.containerId === projectListTicket.id) return;
    const listsWithMovedTickets = getMovedTicketsOtherContainer(event, projectListTicket);
    if (!listsWithMovedTickets) return;
    const { fromList, toList } = listsWithMovedTickets;
    setLists(lists.map((list) => {
      if (list.id === fromList.id) {
        return fromList;
      }
      if (list.id === toList.id) {
        return toList;
      }
      return list;
    }));
    updateMovedTickets([fromList, toList]);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTicket(undefined);
    if (event.active.data.current?.sortable.containerId === projectListTicket.id) {
      const movedLists = getMovedLists(event, lists);
      if (!movedLists) return;
      setLists(movedLists);
      updateMovedLists(movedLists);
    } else {
      const listsWithMovedTickets = getMovedTicketsSameContainer(event, projectListTicket);
      if (!listsWithMovedTickets) return;
      setLists(lists.map((list) => {
        if (list.id === listsWithMovedTickets.id) {
          return listsWithMovedTickets;
        }
        return list
      }));
      updateMovedTickets([listsWithMovedTickets]);
    }
  }
}