"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import defaultImg from '@/public/images/default.jpeg';
import { Project } from '@prisma/client';
import Image from 'next/image';


export function AsideProjectCard({ projectDetail }: { projectDetail: Project }) {
  const pathName = usePathname();
  const href = `/dosuru/${projectDetail.id}`;

  const isCurrent = pathName && pathName.includes(href);
  const addWrapClass = isCurrent ? "bg-secondary" : "bg-base-200";

  return (
    <Link
      href={href}
      className={"flex-row card shadow-sm hover:bg-base-content hover:text-base-100 rounded-xl mb-4 items-center p-2 min-w-[10rem] " + addWrapClass}
    >
      <div className="avatar">
        <div className="mask mask-squircle w-10">
          <Image
            src={projectDetail.image ?? defaultImg.src}
            alt="avatar"
            width={40}
            height={40}
          />
        </div>
      </div>
      <div className="flex-col ml-2">
        <h2 className="text-md">{projectDetail.name}</h2>
      </div>
    </Link>
  );
}