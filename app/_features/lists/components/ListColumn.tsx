"use client";
import { TicketCard } from '@/app/_features/tickets/components/TicketCard';
import { TicketUpdateForm } from '@/app/_features/tickets/forms/UpdateForm';
import {
  getMovedLists,
  getMovedTicketsOtherContainer,
  getMovedTicketsSameContainer,
  updateMovedLists,
  updateMovedTickets
} from '@/app/_lib/dnd_kit/actions';
import { customClosestCorners } from '@/app/_lib/dnd_kit/customClosestCorners';
import type { ListTicket, ProjectListTicket } from '@/app/_util/types/nestedType';
import { DndContext, type DragEndEvent, type DragOverEvent, DragOverlay, type DragStartEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { Ticket } from '@prisma/client';
import { useEffect, useState } from 'react';
import { ListCreateForm } from '../forms/CreateForm';
import { ListUpdateForm } from '../forms/UpdateForm';
import { ListCard } from './ListCard';


export function ListColumn({ projectListTicket }: { projectListTicket: ProjectListTicket }) {
  const [lists, setLists] = useState<ListTicket[]>(projectListTicket.lists);
  const [activeTicket, setActiveTicket] = useState<Ticket | undefined>();


  useEffect(() => {
    setLists(projectListTicket.lists);
  }, [projectListTicket.lists]);

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
          {lists.map((list) => (
            <ListCard list={list} key={list.id} />
          ))}
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
      <ListUpdateForm />
      <TicketUpdateForm />
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