"use client";
import React, { useContext } from 'react'
import { CommentSchemaType, commentSchema } from '../schema';
import { updateComment } from '../actions';
import { SetTicketNestedDataContext } from '@/app/_features/lists/components/ListColumn';
import { useFormActionHandler } from '@/app/_util/hooks/useFormActionHandler';
import { Comment } from '@prisma/client';
import { CancelButton } from '@/app/_components/buttons/CancelButton';
import { SaveButton } from '@/app/_components/buttons/SaveButton';

export function CommentUpdateForm({
  comment,
  ticketId,
  setIsEditing
}: {
  comment: Comment,
  ticketId: string,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}) {

  const setTicketModalData = useContext(SetTicketNestedDataContext);

  const { register, handleSubmit, errors, isSubmitting } = useFormActionHandler<CommentSchemaType>({
    schema: commentSchema,
    handleAction: updateComment,
    targetId: comment.id,
    onSuccess: () => {
      setTicketModalData(ticketId);
      setIsEditing(false);
    },
  })

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          {...register('text', { value: comment.text })}
          className='text-md text-base-content w-full min-h-20 bg-base-100 resize-none focus:outline-none p-2'
        />
        {errors.text && <p className="text-error text-xs mt-1">{errors.text.message}</p>}
        <div className='flex px-2 pb-1 justify-between'>
          <div className='self-end'>
            <CancelButton size="sm" onClick={() => setIsEditing(false)} />
          </div>
          <div className='self-end'>
            <SaveButton size='sm' disabled={isSubmitting} />
          </div>
        </div>
      </form>
    </>
  )
}