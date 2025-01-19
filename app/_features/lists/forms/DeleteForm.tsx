"use client";

import { CommonModal } from '@/app/_components/modals/CommonModal'
import { useListModalStore } from '@/app/_features/lists/store/useListModalStore';
import { useClickActionHandler } from '@/app/_util/hooks/useClickActionHandler';
import { useRouter } from 'next/navigation';
import type React from 'react'
import { useRef } from 'react'
import { deleteList } from '../actions';


export function ListDeleteForm({
  listId,
}: {
  listId: string
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const { listModalClose } = useListModalStore();

  const { handleClick, isSubmitting } = useClickActionHandler({
    handleAction: deleteList,
    targetId: listId,
    onSuccess: () => {
      dialog.current?.close();
      listModalClose();
      router.refresh();
    },
  });

  return (
    <>
      <button
        type='button'
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

