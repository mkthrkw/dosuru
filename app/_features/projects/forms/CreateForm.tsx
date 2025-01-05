'use client';

import { createProject } from "../actions";
import { CommonModal } from "@/app/_components/modals/CommonModal";
import { useRef } from "react";
import { projectSchema, ProjectSchemaType } from "../schema";
import { AsideButton } from "@/app/_components/buttons/AsideButton";
import { useFormActionHandler } from "@/app/_util/hooks/useFormActionHandler";

export function ProjectCreateForm() {

  const dialog = useRef<HTMLDialogElement>(null);

  const { register, handleSubmit, errors, isSubmitting } = useFormActionHandler<ProjectSchemaType>({
    schema: projectSchema,
    handleAction: createProject,
    onSuccess: () => {
      dialog.current?.close();
    },
    formReset: true,
  });

  return (
    <>
      <AsideButton onClick={() => dialog.current?.showModal()}>
        +プロジェクト作成
      </AsideButton>
      <CommonModal
        dialog={dialog}
        title="プロジェクト作成"
        text="プロジェクト名と説明を入力してください。"
        isSubmitting={isSubmitting}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
        >
          <input
            {...register("name")}
            type="text"
            className="input input-bordered"
            placeholder="プロジェクト名"
          />
          {errors.name && <p className="text-error mt-1">{errors.name.message}</p>}
          <textarea
            {...register("description")}
            className="textarea h-24 textarea-bordered mt-4"
            placeholder="プロジェクトの説明"
          ></textarea>
          {errors.description && <p className="text-error mt-1">{errors.description.message}</p>}
          <button className="btn btn-primary mt-4">作成</button>
        </form>
      </CommonModal>
    </>
  )
}