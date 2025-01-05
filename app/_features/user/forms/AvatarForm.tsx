"use client";

import defaultImg from '@/public/images/default.jpeg';
import { LoadingDots } from '@/app/_components/common/LoadingDots';
import { User } from '@prisma/client';
import Image from 'next/image';
import { useFileReaderWithAction } from '@/app/_util/hooks/useFileReaderWithAction';
import { updateUserAvatar } from '../actions';
import { AvatarInputButton } from '@/app/_components/buttons/AvatarInputButton';


export function UserAvatarForm({ user }: { user: User }) {

  const { inputRef, handleChange, isSubmitting } = useFileReaderWithAction({
    handleAction: updateUserAvatar,
  });

  return (
    <>
      {isSubmitting && <LoadingDots />}
      <div className='text-center'>
        <div className="avatar">
          <div className="w-48 mask mask-squircle bg-base-200">
            <Image
              src={user.image || defaultImg.src}
              width={192}
              height={192}
              alt="user avatar"
              priority={true}
            />
          </div>
        </div>
        <div className='relative left-16 bottom-8'>
          <AvatarInputButton onClick={() => inputRef.current?.click()} />
          <input
            type="file"
            className='hidden'
            ref={inputRef}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  )
}
