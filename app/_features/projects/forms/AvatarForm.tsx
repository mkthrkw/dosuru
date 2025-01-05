"use client";

import { updateProjectAvatar } from '../actions';
import defaultImg from '@/public/images/default.jpeg';
import { useFileReaderWithAction } from '@/app/_util/hooks/useFileReaderWithAction';
import { LoadingDots } from '@/app/_components/common/LoadingDots';
import Image from 'next/image';
import { Project } from '@prisma/client';
import { AvatarInputButton } from '@/app/_components/buttons/AvatarInputButton';

export function ProjectAvatarForm(
  { project }: { project: Project }
) {

  const { inputRef, handleChange, isSubmitting } = useFileReaderWithAction({
    handleAction: updateProjectAvatar,
    targetId: project.id,
  });

  return (
    <>
      {isSubmitting && <LoadingDots />}
      <div className='text-center'>
        <div className="avatar">
          <div className="w-48 mask mask-squircle bg-base-200">
            <Image
              src={project.image ?? defaultImg.src}
              alt="project avatar"
              width={192}
              height={192}
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
