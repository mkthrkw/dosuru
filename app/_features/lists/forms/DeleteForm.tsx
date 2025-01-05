"use client";

import React, { useRef } from 'react'
import { CommonModal } from '@/app/_components/modals/CommonModal'
import { useRouter } from 'next/navigation';
import { deleteList } from '../actions';
import { useClickActionHandler } from '@/app/_util/hooks/useClickActionHandler';


export function ListDeleteForm({
  listId,
  underDialog,
}: {
  listId: string
  underDialog: React.RefObject<HTMLDialogElement | null>
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const { handleClick, isSubmitting } = useClickActionHandler({
    handleAction: deleteList,
    targetId: listId,
    onSuccess: () => {
      dialog.current?.close();
      underDialog.current?.close();
      router.refresh();
    },
  });

  return (
    <>
      <button
        className='btn btn-outline text-red-500/50 hover:border-red-300 hover:bg-red-300 w-56 self-center'
        onClick={() => dialog.current?.showModal()}
      >
        リストの削除
      </button>
      <CommonModal
        dialog={dialog}
        title='リストの削除'
        text='取り消しは出来ませんが、本当に削除しますか？'
        addClass='w-fit'
        isSubmitting={isSubmitting}
      >
        <button
          className='btn btn-outline btn-error btn-wide'
          onClick={handleClick}
        >
          削除実行
        </button>
      </CommonModal>
    </>
  )
}

