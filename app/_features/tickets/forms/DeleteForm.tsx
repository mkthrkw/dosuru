"use client";

import { CommonModal } from '@/app/_components/modals/CommonModal'
import { useClickActionHandler } from '@/app/_util/hooks/useClickActionHandler';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'
import { useTicketModalStore } from '../../lists/store/useTicketModalStore';
import { deleteTicket } from '../actions';


export function TicketDeleteForm({
  ticketId,
}: {
  ticketId: string
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const { ticketModalClose } = useTicketModalStore();

  const { handleClick, isSubmitting } = useClickActionHandler({
    handleAction: deleteTicket,
    targetId: ticketId,
    onSuccess: () => {
      dialog.current?.close();
      ticketModalClose();
      router.refresh();
    },
  });

  return (
    <>
      <button
        type="button"
        className='text-error/80'
        onClick={() => dialog.current?.showModal()}
      >
        <TrashIcon className='w-5 h-5 text-error/50' />
        チケットの削除
      </button>
      <CommonModal
        dialog={dialog}
        title='チケットの削除'
        text='取り消しは出来ませんが、本当に削除しますか？'
        addClass='m-auto inset-0 fixed h-fit w-fit justify-self-center'
        isSubmitting={isSubmitting}
      >
        <form onSubmit={handleClick}>
          <button
            type='submit'
            className='btn btn-outline btn-error btn-wide'
          >
            削除実行
          </button>
        </form>
      </CommonModal>
    </>
  )
}

