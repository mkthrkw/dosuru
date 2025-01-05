import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@prisma/client';
import defaultImg from '@/public/images/default.jpeg';

export function ProjectCard({ project }: { project: Project }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-24 flex flex-row items-center rounded-xl shadow-sm w-full"
    >
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className='w-8 text-center bg-base-content/30 h-full content-center rounded-l-xl text-base-100 text-lg'
      >
        :::
      </div>
      <Link
        href={`/dosuru/${project.id}`}
        className="flex items-center w-full px-3 py-2 hover:bg-base-content/50 bg-base-content/20 rounded-r-xl"
      >
        <div className="avatar">
          <div className="mask mask-squircle w-20">
            <Image
              src={project.image || defaultImg.src}
              alt="Project Avatar"
              width={80}
              height={80}
            />
          </div>
        </div>
        <div className="flex-col ml-4">
          <h2 className="text-lg">{project.name}</h2>
          <p className="text-base-content text-sm">{project.description}</p>
        </div>
      </Link>
    </div>
  );
}