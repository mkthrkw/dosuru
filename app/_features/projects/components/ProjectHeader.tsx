import { PencilIcon } from "@heroicons/react/24/solid"


export function ProjectHeader({
  projectId,
  projectName,
}: {
  projectId: string,
  projectName: string
}) {
  return (
    <div className='flex pt-2 pb-1 justify-center gap-3 lg:mt-[-50px] lg:mb-4'>
      <h1 className="text-2xl text-primary/50 lg:text-base-content/70 z-10">{projectName}</h1>
      <div className="tooltip tooltip-bottom" data-tip="プロジェクトの編集">
        <a href={`/dosuru/${projectId}/setting`}>
          <div className="hover:cursor-pointer rounded-xl p-1 border-2 border-primary/50 hover:border-accent text-primary/50 hover:text-accent lg:text-base-content/70 lg:border-base-content/70">
            <PencilIcon className="w-5 h-5" />
          </div>
        </a>
      </div>
    </div>
  )
}