"use client";
import React, { useState } from 'react'
import { ticketSchema, TicketSchemaType } from '../schema';
import { createTicket } from '../actions';
import { useRouter } from 'next/navigation';
import { PencilIcon } from "@heroicons/react/24/solid"
import { LoadingDots } from '@/app/_components/common/LoadingDots';
import { useFormActionHandler } from '@/app/_util/hooks/useFormActionHandler';

export function TicketCreateForm({
  listId,
}: {
  listId: string
}) {

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, errors, isSubmitting } = useFormActionHandler<TicketSchemaType>({
    schema: ticketSchema,
    handleAction: createTicket,
    targetId: listId,
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    formReset: true,
  });

  return (
    <>
      {isSubmitting && <LoadingDots />}
      <div className='px-4'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-xs btn-outline btn-primary w-full"
        >
          {isOpen ? '閉じる' : 'チケットを追加'}
        </button>
      </div>
      {isOpen && (
        <div className='px-2 mt-2'>
          <form
            onSubmit={handleSubmit}
            className="flex text-left w-full shadow-sm rounded-xl px-2 py-1 bg-base-100 text-base-content h-16 items-center justify-between gap-4"
          >
            <div className='flex flex-col w-full'>
              <input
                {...register('title')}
                className="border-b-2 bg-base-100 focus:outline-none focus:border-primary"
              />
              {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
            </div>
            <button
              type='submit'
              className="hover:cursor-pointer rounded-xl p-1 border-2 border-primary/50 hover:border-accent text-primary hover:text-accent"
            >
              <PencilIcon className='w-5 h-5' />
            </button>
          </form>
        </div>
      )}
    </>
  )
}