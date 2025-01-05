import { Comment, List, Project, Ticket } from "@prisma/client";

export type ProjectListTicket = Project & {
  lists: (List & {
    tickets: Ticket[];
  })[];
};

export type ListTicket = List & {
  tickets: Ticket[];
};

export type TicketComment = Ticket & {
  comments: Comment[];
};
