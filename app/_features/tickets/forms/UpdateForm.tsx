"use client";
import { FormModal } from '@/app/_components/modals/FormModal';
import { CommentColumn } from '@/app/_features/comments/components/CommentColumn';
import { CompleteBadge } from '@/app/_features/tickets/components/CompleteBadge';
import { getDateInputStyle, getDateTimeFullStyle } from '@/app/_lib/tempo/format';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';
import type React from 'react'
import { useEffect } from 'react'
import { useTicketModalStore } from '../../lists/store/useTicketModalStore';
import { useTicketCompleteHandler } from '../hooks/useTicketCompleteHandler';
import { useTicketUpdateHandler } from '../hooks/useTicketUpdateHandler';
import { TicketDeleteForm } from './DeleteForm';

export function TicketUpdateForm() {

  const { isTicketModalOpen, ticketModalProps, ticketModalClose } = useTicketModalStore();

  const { completed, setCompleted, handleToggle } = useTicketCompleteHandler();

  const { register, handleSubmit, errors, setValue } = useTicketUpdateHandler();

  useEffect(() => {
    if (isTicketModalOpen && ticketModalProps) {
      setValue('title', ticketModalProps.title);
      setValue('description', ticketModalProps.description);
      setValue('startAt', getDateInputStyle(ticketModalProps.startAt));
      setValue('endAt', getDateInputStyle(ticketModalProps.endAt));
      setCompleted(ticketModalProps.completed);
    }
  }, [isTicketModalOpen, ticketModalProps, setValue, setCompleted]);


  return (
    <>
      <FormModal
        isOpen={isTicketModalOpen}
        modalClose={ticketModalClose}
        className='px-2 overflow-hidden pb-1 pt-3 min-h-[80vh] max-h-[95vh]'
      >
        {ticketModalProps &&
          <>
            <div className='flex justify-between px-4 text-base-content/40 pb-2'>
              <div>#{ticketModalProps?.displayId}</div>
              <div className='flex items-center gap-2 mr-10'>
                <input
                  type="checkbox"
                  className="toggle toggle-success toggle-sm"
                  checked={completed}
                  onChange={handleToggle}
                />
                <CompleteBadge completed={completed} />
              </div>
            </div>
            <div className='flex px-4 border-b'>
              <form onBlur={handleSubmit} className="flex flex-col gap-1 w-full">
                <input
                  {...register('title', { value: ticketModalProps?.title })}
                  className="bg-base-100 px-2 text-xl text-base-content/70 focus:text-base-content focus:outline-none focus:border-b-2 focus:border-primary/80"
                />
                {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
                <textarea
                  {...register('description', { value: ticketModalProps?.description })}
                  className='h-14 rounded-lg resize-none px-2 py-0 bg-base-100 text-base-content/50 focus:text-base-content focus:outline-none focus:border-2 focus:border-primary/80'
                />
                {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
                {/* ======================= */}
                <div className='flex flex-wrap text-sm text-base-content/50 pb-3 px-2 justify-around gap-2'>
                  {/* startAt */}
                  <div className='flex-1 items-center'>
                    <label htmlFor="startAt">開始：</label>
                    <input
                      id="startAt"
                      type="date"
                      className='text-center bg-base-100 border border-base-content/20 rounded-xl py-0 w-36 focus:text-base-content focus:outline-none focus:border-primary/80'
                      {...register("startAt")}
                    />
                    {errors.startAt && <p className="text-error text-xs mt-1">{errors.startAt.message}</p>}
                  </div>
                  {/* endAt */}
                  <div className='flex-1 items-center'>
                    <label htmlFor="endAt">終了：</label>
                    <input
                      id="endAt"
                      type="date"
                      className='text-center bg-base-100 border border-base-content/20 rounded-xl py-0 w-36 focus:text-base-content focus:outline-none focus:border-primary/80'
                      {...register("endAt")}
                    />
                    {errors.endAt && <p className="text-error text-xs mt-1">{errors.endAt.message}</p>}
                  </div>
                </div>
              </form>
            </div>
            <div className='overflow-auto max-h-[70vh] px-4 pb-16'>
              <CommentColumn modalProps={ticketModalProps} />
            </div>
            <div className='flex justify-between items-center px-4 border-t h-12 absolute bottom-0 left-0 bg-base-100 w-full'>
              <div className='flex flex-col text-xs text-base-content/50 text-left'>
                <div>作成日時：{getDateTimeFullStyle(ticketModalProps?.createdAt)}</div>
                <div>更新日時：{getDateTimeFullStyle(ticketModalProps?.updatedAt)}</div>
              </div>
              <div className="dropdown dropdown-top dropdown-end">
                <button type="button" className="text-base-content/50 hover:text-primary">
                  <EllipsisHorizontalCircleIcon className='w-8 h-8' />
                </button>
                <ul className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow">
                  <li><TicketDeleteForm ticketId={ticketModalProps?.id ?? ''} /></li>
                </ul>
              </div>
            </div>
          </>
        }
      </FormModal>
    </>
  )
}