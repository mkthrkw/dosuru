"use client";

import { updateProject } from "../actions";
import { projectSchema, ProjectSchemaType } from "../schema";
import { useRouter } from "next/navigation";
import { LoadingDots } from "@/app/_components/common/LoadingDots";
import { useFormActionHandler } from "@/app/_util/hooks/useFormActionHandler";
import { Project } from "@prisma/client";

export function ProjectUpdateForm(
  { project }: { project: Project }
) {

  const router = useRouter();
  const { register, handleSubmit, errors, isSubmitting } = useFormActionHandler<ProjectSchemaType>({
    schema: projectSchema,
    handleAction: updateProject,
    targetId: project.id,
    onSuccess: router.refresh,
    formReset: false,
  })


  return (
    <>
      {isSubmitting && <LoadingDots />}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col"
      >
        <label className="label">プロジェクト名</label>
        <input
          {...register('name', { value: project.name })}
          className="input input-bordered"
        />
        {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
        <label className="label mt-4">プロジェクトの説明</label>
        <textarea
          {...register('description', { value: project.description })}
          className="textarea h-24 textarea-bordered mb-4"
        />
        {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
        <button className="btn btn-primary mt-4">更新</button>
      </form>
    </>
  )
}