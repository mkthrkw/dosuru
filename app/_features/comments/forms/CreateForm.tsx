"use client";
import { createComment } from '../actions';
import { type CommentSchemaType, commentSchema } from '../schema';

import { AddButton } from '@/app/_components/buttons/AddButton';
import { useFormActionHandler } from '@/app/_util/hooks/useFormActionHandler';
import { useTicketModalStore } from '../../lists/store/useTicketModalStore';

export function CommentCreateForm({
  ticketId,
}: {
  ticketId: string,
}) {

  const { setTicketModalProps } = useTicketModalStore();

  const { register, handleSubmit, errors, isSubmitting } = useFormActionHandler<CommentSchemaType>(
    {
      schema: commentSchema,
      handleAction: createComment,
      targetId: ticketId,
      onSuccess: () => setTicketModalProps(ticketId),
      formReset: true,
      mode: "onSubmit"
    }
  );

  return (
    <>
      <h2 className='text-sm font-bold text-left text-base-content/50'>コメント</h2>
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col w-full shadow-sm rounded-xl bg-base-100 justify-between border-2 border-base-content/10 focus-within:border-primary/80"
      >
        <textarea
          {...register('text')}
          className="w-full min-h-24 bg-base-100 focus:outline-none resize-none px-2 pt-2 text-base-content text-left"
        />
        {errors.text && (
          <p className='text-xs text-accent text-left px-2'>{errors.text.message}</p>
        )}
        <AddButton size="sm" disabled={isSubmitting} className='absolute right-2 bottom-1' label="コメント追加" />
      </form>
    </>
  )
}