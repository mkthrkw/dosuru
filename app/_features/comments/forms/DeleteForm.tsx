"use client";

import { CommonModal } from '@/app/_components/modals/CommonModal'
import { useClickActionHandler } from '@/app/_util/hooks/useClickActionHandler';
import { TrashIcon } from '@heroicons/react/24/solid';
import React, { useRef } from 'react'
import { useTicketModalStore } from '../../lists/store/useTicketModalStore';
import { deleteComment } from '../actions';


export function CommentDeleteForm({
  commentId,
  ticketId,
}: {
  commentId: string,
  ticketId: string,
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { setTicketModalProps } = useTicketModalStore();

  const { handleClick, isSubmitting } = useClickActionHandler({
    handleAction: deleteComment,
    targetId: commentId,
    onSuccess: () => {
      dialog.current?.close();
      setTicketModalProps(ticketId);
    }
  })

  return (
    <>
      <button
        type='button'
        className='p-0'
        onClick={() => dialog.current?.showModal()}
      >
        <TrashIcon
          className='w-5 h-5 text-error/20 hover:text-error' />
      </button>
      <CommonModal
        dialog={dialog}
        title='コメントの削除'
        text='取り消しは出来ませんが、本当に削除しますか？'
        isSubmitting={isSubmitting}
      >
        <button
          type='button'
          className='btn btn-outline btn-error btn-wide'
          onClick={handleClick}
        >
          削除実行
        </button>
      </CommonModal>
    </>
  )
}

