"use client";
import { FormModal } from '@/app/_components/modals/FormModal';
import { useListModalStore } from '@/app/_features/lists/store/useListModalStore';
import {
  grayScale,
  retroPop,
  tuttiFrutti,
} from '@/app/_util/colors/colorPalette';
import { useFormActionHandler } from '@/app/_util/hooks/useFormActionHandler';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { updateList } from '../actions';
import { type ListSchemaType, listSchema } from '../schema';
import { ListDeleteForm } from './DeleteForm';

export function ListUpdateForm() {

  const colors = [
    tuttiFrutti,
    retroPop,
    grayScale,
  ];
  const [colorState, setColorState] = React.useState<string>('');

  const router = useRouter();
  const { isListModalOpen, listModalProps, listModalClose } = useListModalStore();

  const { register, handleSubmit, errors, isSubmitting, setValue } = useFormActionHandler<ListSchemaType>({
    schema: listSchema,
    handleAction: updateList,
    targetId: listModalProps?.id,
    onSuccess: () => {
      listModalClose();
      router.refresh();
    },
    formReset: false,
  });

  useEffect(() => {
    if (isListModalOpen && listModalProps) {
      setValue('title', listModalProps.title);
      setValue('color', listModalProps.color);
      setColorState(listModalProps.color);
    }
  }, [isListModalOpen, listModalProps, setValue]);

  return (
    <>
      <FormModal
        isOpen={isListModalOpen}
        modalClose={listModalClose}
        title={'リストの編集'}
        className='overflow-hidden'
        isSubmitting={isSubmitting}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
        >
          <label htmlFor='title' className="label">リスト名</label>
          <input
            id='title'
            {...register('title', { value: listModalProps?.title })}
            className="input input-bordered"
          />
          {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
          <label htmlFor='color' className='label'>リストの色</label>
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
                        id='color'
                        type='radio'
                        {...register('color')}
                        value={color}
                        className='opacity-0 w-full h-full'
                        onClick={() => setColorState(color)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div
              className='w-24 h-24 rounded-full'
              style={{ backgroundColor: colorState }}
            />
          </div>
          <button
            type='submit'
            className="w-72 btn btn-primary mt-8 text-base-100 self-center"
          >
            保存
          </button>
        </form>
        <div className="divider my-6" />
        <ListDeleteForm listId={listModalProps?.id ?? ''} />
      </FormModal>
    </>
  )
}