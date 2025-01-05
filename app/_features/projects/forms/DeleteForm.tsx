"use client";

import React, { useRef } from 'react'
import { CommonModal } from '@/app/_components/modals/CommonModal'
import { deleteProject } from '../actions';
import { redirect } from 'next/navigation';
import { useClickActionHandler } from '@/app/_util/hooks/useClickActionHandler';
import { Project } from '@prisma/client';


export function ProjectDeleteForm(
  { project }: { project: Project },
) {
  const dialog = useRef<HTMLDialogElement>(null);

  const { handleClick, isSubmitting } = useClickActionHandler({
    handleAction: deleteProject,
    targetId: project.id,
    onSuccess: () => {
      dialog.current?.close();
      redirect('/dosuru');
    },
  });

  return (
    <>
      <div className='flex flex-col'>
        <button
          className='btn btn-outline text-red-500/50 hover:border-red-300 hover:bg-red-300'
          onClick={() => dialog.current?.showModal()}
        >
          プロジェクトの削除
        </button>
        <CommonModal
          dialog={dialog}
          title='プロジェクト削除'
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
      </div>
    </>
  )
}

