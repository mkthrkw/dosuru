import Image from 'next/image';
import Link from 'next/link';
import defaultImg from '@/public/images/default.jpeg';
import { getUserInstance } from '../actions';
import { Suspense } from 'react';

export async function UserMenu() {

  const user = await getUserInstance();

  return (
    <div className="tooltip tooltip-left" data-tip="ユーザーの編集">
      <Link href="/dosuru/account" className='btn btn-sm btn-ghost h-10'>
        <div className="avatar">
          <div className="w-9 mask mask-squircle bg-base-100">
            <Suspense fallback={<Image src={defaultImg.src} alt="avatar" width={36} height={36} />}>
              <Image
                src={user?.image || defaultImg.src}
                alt="avatar"
                width={36}
                height={36}
              />
            </Suspense>
          </div>
        </div>
        <span className='hidden lg:inline'>{user?.name ?? '未設定'}</span>
      </Link>
    </div>
  )
}
