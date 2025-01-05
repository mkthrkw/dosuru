"use client";
import { CommonModal } from '@/app/_components/modals/CommonModal';
import React, { useEffect } from 'react'
import { TicketDeleteForm } from './DeleteForm';
import { CommentColumn } from '@/app/_features/comments/components/CommentColumn';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';
import { getDateInputStyle, getDateTimeFullStyle } from '@/app/_lib/tempo/format';
import { CompleteBadge } from '@/app/_features/tickets/components/CompleteBadge';
import { useTicketCompleteHandler } from '../hooks/useTicketCompleteHandler';
import { useTicketUpdateHandler } from '../hooks/useTicketUpdateHandler';
import { TicketComment } from '@/app/_util/types/nestedType';
import { OutputTicketUpdateSchemaType } from '../schema';

export function TicketUpdateForm({
  modalProps,
  updateProps,
  dialog,
}: {
  modalProps: TicketComment | null,
  updateProps: (partialParams: Partial<OutputTicketUpdateSchemaType>) => void,
  dialog: React.RefObject<HTMLDialogElement | null>
}) {

  const { completed, setCompleted, handleToggle } = useTicketCompleteHandler({
    modalProps: modalProps,
    stateUpdateFunction: updateProps,
  });

  const { register, handleSubmit, errors, setValue } = useTicketUpdateHandler({
    modalProps: modalProps,
    stateUpdateFunction: updateProps,
  });

  useEffect(() => {
    if (dialog.current?.open && modalProps) {
      setValue('title', modalProps.title);
      setValue('description', modalProps.description);
      setValue('startAt', getDateInputStyle(modalProps.startAt));
      setValue('endAt', getDateInputStyle(modalProps.endAt));
      setCompleted(modalProps.completed);
    }
  }, [modalProps, dialog, setValue, setCompleted]);


  return (
    <>
      <CommonModal
        dialog={dialog}
        addClass='px-2 overflow-hidden pb-1 pt-3 min-h-[80vh] max-h-[95vh]'
      >
        {modalProps &&
          <>
            <div className='flex justify-between px-4 text-base-content/40 pb-2'>
              <div>#{modalProps?.displayId}</div>
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
                  {...register('title', { value: modalProps?.title })}
                  className="bg-base-100 px-2 text-xl text-base-content/70 focus:text-base-content focus:outline-none focus:border-b-2 focus:border-primary/80"
                />
                {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
                <textarea
                  {...register('description', { value: modalProps?.description })}
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
              <CommentColumn modalProps={modalProps} />
            </div>
            <div className='flex justify-between items-center px-4 border-t h-12 absolute bottom-0 left-0 bg-base-100 w-full'>
              <div className='flex flex-col text-xs text-base-content/50 text-left'>
                <div>作成日時：{getDateTimeFullStyle(modalProps?.createdAt)}</div>
                <div>更新日時：{getDateTimeFullStyle(modalProps?.updatedAt)}</div>
              </div>
              <div className="dropdown dropdown-top dropdown-end">
                <div tabIndex={0} role="button" className="text-base-content/50 hover:text-primary">
                  <EllipsisHorizontalCircleIcon className='w-8 h-8' />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow">
                  <li><TicketDeleteForm ticketId={modalProps?.id ?? ''} underDialog={dialog} /></li>
                </ul>
              </div>
            </div>
          </>
        }
      </CommonModal>
    </>
  )
}