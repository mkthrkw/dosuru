import { UserMenu } from '@/app/_features/user/components/UserMenu';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Logo } from '../common/logo';

export async function Header({ drawerId }: { drawerId: string }) {

  return (
    <header className="w-full navbar bg-primary lg:bg-base-300 min-h-12 px-2 py-0 lg:py-1 sticky top-0 my-0">
      {/* Left hamburger / mobile only */}
      <div className="flex-none lg:hidden">
        <label htmlFor={drawerId} aria-label="open sidebar" className="btn btn-square btn-ghost">
          <Bars3Icon className='inline-block w-6 h-6 text-current' />
        </label>
      </div>
      {/* Header Logo / mobile only */}
      <div className='flex-1 px-2 mx-2 justify-center lg:hidden'>
        <div className='tooltip tooltip-right' data-tip="プロジェクト一覧へ">
          <Link href="/dosuru" className="text-4xl font-bold text-base-content lg:text-primary">
            <Logo />
          </Link>
        </div>
      </div>
      {/* User Menu */}
      <div className='lg:w-full justify-end'>
        <UserMenu />
      </div>
    </header>
  );
}