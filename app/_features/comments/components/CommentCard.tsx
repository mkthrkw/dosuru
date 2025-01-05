"use client";
import React from 'react'
import { format } from "@formkit/tempo"
import { CommentDeleteForm } from '../forms/DeleteForm'
import { CommentUpdateForm } from '../forms/UpdateForm';
import { PencilIcon } from "@heroicons/react/24/solid"
import { Comment } from '@prisma/client';

export function CommentCard({
  comment,
  ticketId
}: {
  comment: Comment
  ticketId: string
}) {

  const [isEditing, setIsEditing] = React.useState(false)
  const displayCreatedAt = format(comment.createdAt, { date: 'short', time: 'short' }, 'ja')
  const borderColor = isEditing ? 'border-primary' : 'border-base-content/10'
  const cardClassName = borderColor + ' flex flex-col justify-between shadow-sm bg-base-100 border-2 w-full min-h-24 rounded-lg'

  return (
    <div className={cardClassName}>
      {isEditing
        ? <CommentUpdateForm
          comment={comment}
          ticketId={ticketId}
          setIsEditing={setIsEditing}
        />
        : <>
          <div className='text-sm break-words text-base-content/60 text-left p-2'>
            {comment.text}
          </div>
          <div className='flex justify-between px-2 pb-1'>
            <div className='text-xs text-base-content/50'>
              作成日時:{displayCreatedAt}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className='text-xs text-primary'
              >
                <PencilIcon className='w-5 h-5 text-primary/20 hover:text-primary' />
              </button>
              <CommentDeleteForm commentId={comment.id} ticketId={ticketId} />
            </div>
          </div>
        </>
      }
    </div>
  )
}