"use client";
import { CommentCard } from './CommentCard'
import { CommentCreateForm } from '../forms/CreateForm';
import { TicketComment } from '@/app/_util/types/nestedType';
import { Comment } from '@prisma/client';

export function CommentColumn({
  modalProps
}: {
  modalProps: TicketComment | null
}) {

  return (
    <div className='pb-4'>
      {modalProps?.comments && (
        <div className='flex flex-col py-2 gap-2'>
          <CommentCreateForm ticketId={modalProps?.id ?? ''} />
          {modalProps?.comments.map((comment: Comment) => (
            <CommentCard comment={comment} ticketId={modalProps?.id ?? ''} key={comment.id} />
          ))}
        </div>
      )}
    </div>
  )
}