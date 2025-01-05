"use client";

import React, { useRef } from 'react'
import { CommonModal } from '@/app/_components/modals/CommonModal'
import { useRouter } from 'next/navigation';
import { deleteTicket } from '../actions';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useClickActionHandler } from '@/app/_util/hooks/useClickActionHandler';


export function TicketDeleteForm({
  ticketId,
  underDialog,
}: {
  ticketId: string
  underDialog: React.RefObject<HTMLDialogElement | null>
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const { handleClick, isSubmitting } = useClickActionHandler({
    handleAction: deleteTicket,
    targetId: ticketId,
    onSuccess: () => {
      dialog.current?.close();
      underDialog.current?.close();
      router.refresh();
    },
  });

  return (
    <>
      <div
        className='text-error/80'
        onClick={() => dialog.current?.showModal()}
      >
        <TrashIcon className='w-5 h-5 text-error/50' />
        チケットの削除
      </div>
      <CommonModal
        dialog={dialog}
        title='チケットの削除'
        text='取り消しは出来ませんが、本当に削除しますか？'
        addClass='m-auto inset-0 fixed h-fit w-fit justify-self-center'
        isSubmitting={isSubmitting}
      >
        <form onSubmit={handleClick}>
          <button
            className='btn btn-outline btn-error btn-wide'
          >
            削除実行
          </button>
        </form>
      </CommonModal>
    </>
  )
}

