import { AsideProjectColumn } from '@/app/_features/projects/components/AsideProjectColumn';
import { ProjectCreateForm } from '@/app/_features/projects/forms/CreateForm';
import { ThemeSelector } from '../common/ThemeSelector';
import Link from 'next/link';
import { Logo } from '../common/logo';

export async function Aside() {

  return (
    <aside className="menu px-3 py-8 w-48 min-h-full bg-primary justify-between">
      <div>
        <div className='mb-8 w-full text-base-content tooltip tooltip-bottom' data-tip="プロジェクト一覧へ">
          <Link href="/dosuru" className="text-5xl">
            <Logo />
          </Link>
        </div >
        <AsideProjectColumn />
      </div>
      <div className='flex flex-col gap-4'>
        <ThemeSelector />
        <ProjectCreateForm />
      </div>
    </aside>
  );
}