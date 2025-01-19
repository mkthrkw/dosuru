"use client";
import { CommonModal } from '@/app/_components/modals/CommonModal';
import {
  grayScale,
  retroPop,
  tuttiFrutti,
} from '@/app/_util/colors/colorPalette';
import { useFormActionHandler } from '@/app/_util/hooks/useFormActionHandler';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { createList } from '../actions';
import { type ListSchemaType, listSchema } from '../schema';

export function ListCreateForm({
  projectId,
}: {
  projectId: string
}) {

  const dialog = useRef<HTMLDialogElement>(null);
  const colors = [
    tuttiFrutti,
    retroPop,
    grayScale,
  ];
  const [color, setColor] = useState<string>(colors[0][0]);
  const router = useRouter();

  const { register, handleSubmit, errors, isSubmitting } = useFormActionHandler<ListSchemaType>({
    schema: listSchema,
    handleAction: createList,
    targetId: projectId,
    onSuccess: () => {
      dialog.current?.close();
      router.refresh();
    },
    formReset: true,
  });

  return (
    <>
      <div className='tooltip tooltip-left' data-tip="リストの追加">
        <button
          type='button'
          onClick={() => dialog.current?.showModal()}
          className="btn w-12 h-12 rounded-full bg-primary/80 hover:bg-accent"
        >
          <span className='text-4xl text-base-100/80 self-baseline'>+</span>
        </button>
      </div>
      <CommonModal
        dialog={dialog}
        title={'リストを追加'}
        isSubmitting={isSubmitting}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
        >
          <label htmlFor='title' className="label">タイトル</label>
          <input
            id='title'
            {...register('title')}
            className="input input-bordered"
          />
          {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
          <p className='label'>リストの色</p>
          <div className='flex gap-4 justify-around px-4 items-center'>
            <div className='flex flex-col gap-2'>
              {colors.map((colorList) => (
                <div className="flex gap-2" key={colorList.join('-')}>
                  {colorList.map((color) => (
                    <div
                      className="w-6 h-6 rounded-full flex-none"
                      style={{ backgroundColor: color }}
                      key={color}
                    >
                      <input
                        type='radio'
                        {...register('color', { value: color })}
                        value={color}
                        className='opacity-0 w-full h-full'
                        onChange={() => setColor(color)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div
              className='w-24 h-24 rounded-full'
              style={{ backgroundColor: color }}
            />
          </div>
          <button
            type='submit'
            className="w-72 btn btn-primary mt-8 text-base-100 self-center"
          >
            作成
          </button>
        </form>
      </CommonModal>
    </>
  )
}